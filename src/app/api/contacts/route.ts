import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ContactRequest } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve all contact requests (Admin only)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.contactRequests || [] });
    }

    const contacts = await ContactRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error: any) {
    console.error('GET Contacts Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Public submission of contact form
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'Missing required contact fields' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newContact = {
        _id: 'contact_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        subject,
        message,
        createdAt: new Date()
      };
      if (!mockDb.contactRequests) mockDb.contactRequests = [];
      mockDb.contactRequests.unshift(newContact);
      return NextResponse.json({ success: true, data: newContact });
    }

    const newContact = await ContactRequest.create({
      name,
      email,
      subject,
      message
    });

    return NextResponse.json({ success: true, data: newContact });
  } catch (error: any) {
    console.error('POST Contact Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove contact request (Admin only)
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
      return NextResponse.json({ success: false, error: 'Contact Request ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.contactRequests.findIndex((c: any) => c._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Contact Request not found' }, { status: 404 });
      }
      mockDb.contactRequests.splice(index, 1);
      return NextResponse.json({ success: true, message: 'Contact request removed' });
    }

    const deleted = await ContactRequest.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Contact request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Contact request removed successfully' });
  } catch (error: any) {
    console.error('DELETE Contact Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
