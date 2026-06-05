import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { WorkerProfile, User } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      if (userId) {
        const user = mockDb.users.find((u: any) => u._id === userId);
        if (!user) {
          return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        const profile = mockDb.workerProfiles.find((p: any) => p.userId === userId);
        // Exclude passwordHash
        const { passwordHash, ...userRest } = user;
        return NextResponse.json({ success: true, user: userRest, profile: profile || null });
      }

      const currentUser = await getAuthUser();
      if (!currentUser) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const currentUserId = currentUser.id || currentUser._id;
      const profile = mockDb.workerProfiles.find((p: any) => p.userId === currentUserId);
      return NextResponse.json({ success: true, user: currentUser, profile: profile || null });
    }

    if (userId) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const profile = await WorkerProfile.findOne({ userId });
      return NextResponse.json({ success: true, user, profile });
    }

    // Default to currently logged in user profile
    const currentUser = await getAuthUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await WorkerProfile.findOne({ userId: currentUser._id });
    return NextResponse.json({ success: true, user: currentUser, profile });
  } catch (error: any) {
    console.error('GET Profile Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const body = await req.json();
      const { bio, experienceYears, skills, prevEvents, fullName, mobileNumber } = body;

      const currentUserId = currentUser.id || currentUser._id;

      const user = mockDb.users.find((u: any) => u._id === currentUserId);
      if (user) {
        if (fullName) user.fullName = fullName;
        if (mobileNumber) user.mobileNumber = mobileNumber;
      }

      let profile = mockDb.workerProfiles.find((p: any) => p.userId === currentUserId);
      if (!profile) {
        profile = {
          _id: 'profile_' + Math.random().toString(36).substring(2, 9),
          userId: currentUserId,
          bio: '',
          experienceYears: '0',
          skills: [],
          prevEvents: [],
          rating: 5.0,
          completedJobsCount: 0,
          isVerified: true
        };
        mockDb.workerProfiles.push(profile);
      }

      if (bio !== undefined) profile.bio = bio;
      if (experienceYears !== undefined) profile.experienceYears = experienceYears;
      if (skills !== undefined) {
        profile.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (prevEvents !== undefined) {
        profile.prevEvents = Array.isArray(prevEvents) ? prevEvents : prevEvents.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      return NextResponse.json({ success: true, profile });
    }

    const body = await req.json();
    const { bio, experienceYears, skills, prevEvents, fullName, mobileNumber } = body;

    // Update user info
    if (fullName || mobileNumber) {
      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (mobileNumber) updateData.mobileNumber = mobileNumber;
      await User.findByIdAndUpdate(currentUser._id, updateData);
    }

    // Update profile info
    const profileUpdate: any = {};
    if (bio !== undefined) profileUpdate.bio = bio;
    if (experienceYears !== undefined) profileUpdate.experienceYears = experienceYears;
    if (skills !== undefined) {
      profileUpdate.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (prevEvents !== undefined) {
      profileUpdate.prevEvents = Array.isArray(prevEvents) ? prevEvents : prevEvents.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updatedProfile = await WorkerProfile.findOneAndUpdate(
      { userId: currentUser._id },
      { $set: profileUpdate },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error('PUT Profile Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
