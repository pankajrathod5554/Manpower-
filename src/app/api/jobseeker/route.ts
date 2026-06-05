import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JobSeeker } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Server-side validation
    const requiredFields = ['fullName', 'mobileNumber', 'email', 'dob', 'gender', 'position'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newCandidate = {
        _id: 'seeker_' + Math.random().toString(36).substring(2, 11),
        ...data,
        status: data.status || 'Applied',
        createdAt: new Date()
      };
      mockDb.jobSeekers.unshift(newCandidate);
      return NextResponse.json({ success: true, data: newCandidate }, { status: 201 });
    }

    const newCandidate = await JobSeeker.create(data);
    return NextResponse.json({ success: true, data: newCandidate }, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/jobseeker:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.jobSeekers }, { status: 200 });
    }

    const candidates = await JobSeeker.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: candidates }, { status: 200 });
  } catch (error: any) {
    console.error('API Error in GET /api/jobseeker:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Candidate ID and status are required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const seekerIndex = mockDb.jobSeekers.findIndex((s: any) => s._id === id);
      if (seekerIndex === -1) {
        return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
      }
      mockDb.jobSeekers[seekerIndex] = {
        ...mockDb.jobSeekers[seekerIndex],
        status
      };
      return NextResponse.json({ success: true, data: mockDb.jobSeekers[seekerIndex] }, { status: 200 });
    }

    const updated = await JobSeeker.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error('API Error in PUT /api/jobseeker:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
