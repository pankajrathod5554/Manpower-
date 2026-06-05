import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'staff') {
      return NextResponse.json({ success: false, error: 'Access denied. Staff only.' }, { status: 403 });
    }

    const eventId = params.id;
    const body = await req.json();
    const { action, location, selfie } = body;

    if (!action || !['checkin', 'checkout'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid attendance action' }, { status: 400 });
    }

    if (!location || !selfie) {
      return NextResponse.json({ success: false, error: 'GPS location and selfie verification are required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const event = mockDb.events.find((e: any) => e._id === eventId);
      if (!event) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }

      // Find staff assignment matching current user
      const staffIndex = event.assignedStaff?.findIndex((s: any) => 
        s.userId === currentUser._id || 
        s.mobileNumber === currentUser.mobileNumber
      );

      if (staffIndex === undefined || staffIndex === -1) {
        return NextResponse.json({ success: false, error: 'You are not assigned to this event' }, { status: 403 });
      }

      const staffRecord = event.assignedStaff[staffIndex];
      if (action === 'checkin') {
        staffRecord.checkInTime = new Date();
        staffRecord.checkInLocation = location;
        staffRecord.checkInSelfie = selfie;
      } else {
        staffRecord.checkOutTime = new Date();
        staffRecord.checkOutLocation = location;
        staffRecord.checkOutSelfie = selfie;
      }

      // Update mock database record
      event.assignedStaff[staffIndex] = staffRecord;
      return NextResponse.json({ success: true, data: event });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Find staff assignment matching current user
    const staffRecord = event.assignedStaff.find((s: any) => 
      s.userId?.toString() === currentUser._id?.toString() || 
      s.mobileNumber === currentUser.mobileNumber
    );

    if (!staffRecord) {
      return NextResponse.json({ success: false, error: 'You are not assigned to this event' }, { status: 403 });
    }

    if (action === 'checkin') {
      staffRecord.checkInTime = new Date();
      staffRecord.checkInLocation = location;
      staffRecord.checkInSelfie = selfie;
    } else {
      staffRecord.checkOutTime = new Date();
      staffRecord.checkOutLocation = location;
      staffRecord.checkOutSelfie = selfie;
    }

    await event.save();
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Attendance Logging Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
