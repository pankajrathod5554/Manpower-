import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Booking } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// GET: Retrieve bookings (Admin only)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.bookings || [] });
    }

    const bookings = await Booking.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('GET Bookings Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Public submission of a staffing request booking
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { 
      companyName, 
      contactPerson, 
      mobileNumber, 
      email, 
      eventName, 
      eventDate, 
      eventLocation, 
      staffCategory, 
      staffCount, 
      notes 
    } = body;

    if (!companyName || !contactPerson || !mobileNumber || !email || !eventName || !eventDate || !eventLocation || !staffCategory || !staffCount) {
      return NextResponse.json({ success: false, error: 'Missing required booking fields' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newBooking = {
        _id: 'booking_' + Math.random().toString(36).substring(2, 9),
        companyName,
        contactPerson,
        mobileNumber,
        email,
        eventName,
        eventDate,
        eventLocation,
        staffCategory,
        staffCount: Number(staffCount),
        notes: notes || '',
        createdAt: new Date()
      };
      if (!mockDb.bookings) mockDb.bookings = [];
      mockDb.bookings.unshift(newBooking);
      return NextResponse.json({ success: true, data: newBooking });
    }

    const newBooking = await Booking.create({
      companyName,
      contactPerson,
      mobileNumber,
      email,
      eventName,
      eventDate,
      eventLocation,
      staffCategory,
      staffCount: Number(staffCount),
      notes: notes || ''
    });

    return NextResponse.json({ success: true, data: newBooking });
  } catch (error: any) {
    console.error('POST Booking Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Cancel or archive booking (Admin only)
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
      return NextResponse.json({ success: false, error: 'Booking ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.bookings.findIndex((b: any) => b._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }
      mockDb.bookings.splice(index, 1);
      return NextResponse.json({ success: true, message: 'Booking removed' });
    }

    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Booking removed successfully' });
  } catch (error: any) {
    console.error('DELETE Booking Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
