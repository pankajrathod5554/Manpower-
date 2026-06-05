import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Job } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const clientType = searchParams.get('clientType');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'open'; // default to open

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      let filteredJobs = [...mockDb.jobs];

      if (category) {
        filteredJobs = filteredJobs.filter(j => j.category === category);
      }
      if (clientType) {
        filteredJobs = filteredJobs.filter(j => j.clientType === clientType);
      }
      if (status && status !== 'all') {
        filteredJobs = filteredJobs.filter(j => j.status === status);
      }
      if (location) {
        filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (search) {
        const queryStr = search.toLowerCase();
        filteredJobs = filteredJobs.filter(j => 
          j.title.toLowerCase().includes(queryStr) || 
          j.description.toLowerCase().includes(queryStr)
        );
      }

      const populatedJobs = filteredJobs.map(job => {
        const creator = mockDb.users.find((u: any) => u._id === job.createdBy);
        return {
          ...job,
          createdBy: creator ? { _id: creator._id, fullName: creator.fullName, email: creator.email, mobileNumber: creator.mobileNumber } : null
        };
      });

      return NextResponse.json({ success: true, data: populatedJobs });
    }

    const query: any = {};

    if (category) query.category = category;
    if (clientType) query.clientType = clientType;
    if (status && status !== 'all') query.status = status;
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'fullName email mobileNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error('GET Jobs Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    if (user.role !== 'employer' && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only employers or admins can post jobs.' }, { status: 403 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const body = await req.json();
      const { title, description, category, clientType, location, date, durationHours, payRatePerHour, slots } = body;

      if (!title || !description || !category || !clientType || !location || !date || !durationHours || !payRatePerHour || !slots) {
        return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
      }

      const creatorId = user.id || user._id;

      const newJob = {
        _id: 'job_' + Math.random().toString(36).substring(2, 9),
        title,
        description,
        category,
        clientType,
        location,
        date,
        durationHours: Number(durationHours),
        payRatePerHour: Number(payRatePerHour),
        slots: Number(slots),
        filledSlots: 0,
        status: 'open',
        createdBy: creatorId,
        createdAt: new Date()
      };
      mockDb.jobs.push(newJob);

      const creatorUser = mockDb.users.find((u: any) => u._id === creatorId);
      const dataResponse = {
        ...newJob,
        createdBy: creatorUser ? { fullName: creatorUser.fullName, email: creatorUser.email } : null
      };

      return NextResponse.json({ success: true, data: dataResponse }, { status: 201 });
    }

    const body = await req.json();
    const { title, description, category, clientType, location, date, durationHours, payRatePerHour, slots } = body;

    // Validate fields
    if (!title || !description || !category || !clientType || !location || !date || !durationHours || !payRatePerHour || !slots) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const newJob = await Job.create({
      title,
      description,
      category,
      clientType,
      location,
      date,
      durationHours: Number(durationHours),
      payRatePerHour: Number(payRatePerHour),
      slots: Number(slots),
      filledSlots: 0,
      status: 'open',
      createdBy: user._id
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('POST Job Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
