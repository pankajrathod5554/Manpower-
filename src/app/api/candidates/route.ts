import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Candidate } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve all candidates (Admin only)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.candidates || [] });
    }

    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: candidates });
  } catch (error: any) {
    console.error('GET Candidates Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Public candidate registration
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { 
      fullName, 
      mobileNumber, 
      whatsAppNumber, 
      email, 
      city, 
      gender, 
      age, 
      category, 
      experience, 
      aadhaarPhoto, 
      profilePhoto 
    } = body;

    if (!fullName || !mobileNumber || !whatsAppNumber || !email || !city || !gender || !age || !category || !experience || !aadhaarPhoto || !profilePhoto) {
      return NextResponse.json({ success: false, error: 'Missing required registration fields' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newCandidate = {
        _id: 'candidate_' + Math.random().toString(36).substring(2, 9),
        fullName,
        mobileNumber,
        whatsAppNumber,
        email,
        city,
        gender,
        age: Number(age),
        category,
        experience,
        aadhaarPhoto,
        profilePhoto,
        createdAt: new Date()
      };
      if (!mockDb.candidates) mockDb.candidates = [];
      mockDb.candidates.unshift(newCandidate);
      return NextResponse.json({ success: true, data: newCandidate });
    }

    const newCandidate = await Candidate.create({
      fullName,
      mobileNumber,
      whatsAppNumber,
      email,
      city,
      gender,
      age: Number(age),
      category,
      experience,
      aadhaarPhoto,
      profilePhoto
    });

    return NextResponse.json({ success: true, data: newCandidate });
  } catch (error: any) {
    console.error('POST Candidate Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove candidate registration (Admin only)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.candidates.findIndex((c: any) => c._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
      }
      mockDb.candidates.splice(index, 1);
      return NextResponse.json({ success: true, message: 'Candidate registration removed' });
    }

    const deleted = await Candidate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Candidate registration removed successfully' });
  } catch (error: any) {
    console.error('DELETE Candidate Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
