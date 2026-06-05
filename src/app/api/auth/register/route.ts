import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import { User, WorkerProfile } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const { email, password, fullName, mobileNumber, role } = await req.json();

      if (!email || !password || !fullName || !mobileNumber || !role) {
        return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
      }

      if (!['employer', 'worker'].includes(role)) {
        return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
      }

      const existingUser = mockDb.users.find((u: any) => u.email === email.toLowerCase());
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'User already exists with this email' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Math.random().toString(36).substring(2, 9),
        email: email.toLowerCase(),
        passwordHash,
        role,
        fullName,
        mobileNumber,
        createdAt: new Date()
      };
      mockDb.users.push(newUser);

      if (role === 'worker') {
        mockDb.workerProfiles.push({
          _id: 'profile_' + Math.random().toString(36).substring(2, 9),
          userId: newUser._id,
          bio: 'Hello! I am a verified crew member ready to support your events.',
          experienceYears: '0',
          skills: ['Hospitality', 'Service'],
          rating: 5.0,
          completedJobsCount: 0,
          isVerified: true,
          prevEvents: []
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Registration successful (Mock Mode)',
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          fullName: newUser.fullName
        }
      }, { status: 201 });
    }

    const { email, password, fullName, mobileNumber, role } = await req.json();

    if (!email || !password || !fullName || !mobileNumber || !role) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (!['employer', 'worker'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists with this email' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role,
      fullName,
      mobileNumber
    });

    // Create Worker Profile if role is worker
    if (role === 'worker') {
      await WorkerProfile.create({
        userId: newUser._id,
        bio: 'Hello! I am a verified crew member ready to support your events.',
        experienceYears: '0',
        skills: ['Hospitality', 'Service'],
        rating: 5.0,
        completedJobsCount: 0,
        isVerified: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
