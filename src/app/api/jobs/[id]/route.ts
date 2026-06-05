import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Job } from '@/lib/models';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const job = mockDb.jobs.find((j: any) => j._id === id);
      if (!job) {
        return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
      }
      const creator = mockDb.users.find((u: any) => u._id === job.createdBy);
      const dataResponse = {
        ...job,
        createdBy: creator ? { _id: creator._id, fullName: creator.fullName, email: creator.email, mobileNumber: creator.mobileNumber } : null
      };
      return NextResponse.json({ success: true, data: dataResponse });
    }

    const job = await Job.findById(id).populate('createdBy', 'fullName email mobileNumber');

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    console.error('GET Job Detail Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
