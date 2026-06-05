import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { EmployerInquiry } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Server-side validation
    const requiredFields = ['companyName', 'contactPerson', 'mobileNumber', 'email', 'eventName', 'eventDate', 'eventLocation', 'staffCount', 'staffCategory'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newInquiry = {
        _id: 'inq_' + Math.random().toString(36).substring(2, 11),
        ...data,
        status: data.status || 'Pending',
        createdAt: new Date()
      };
      mockDb.employerInquiries.unshift(newInquiry);
      return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
    }

    const newInquiry = await EmployerInquiry.create(data);
    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/employer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.employerInquiries }, { status: 200 });
    }

    const inquiries = await EmployerInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error: any) {
    console.error('API Error in GET /api/employer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Inquiry ID and status are required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const inquiryIndex = mockDb.employerInquiries.findIndex((i: any) => i._id === id);
      if (inquiryIndex === -1) {
        return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
      }
      mockDb.employerInquiries[inquiryIndex] = {
        ...mockDb.employerInquiries[inquiryIndex],
        status
      };
      return NextResponse.json({ success: true, data: mockDb.employerInquiries[inquiryIndex] }, { status: 200 });
    }

    const updated = await EmployerInquiry.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error('API Error in PUT /api/employer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
