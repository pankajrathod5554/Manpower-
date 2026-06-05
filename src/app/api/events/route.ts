import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event, User } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// GET: Fetch Events
// Admins get all events, Staff members get only their assigned events
export async function GET(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      if (currentUser.role === 'admin') {
        return NextResponse.json({ success: true, data: mockDb.events });
      } else {
        // Staff can see only events assigned to them (by user ID or mobile number match)
        const staffEvents = mockDb.events.filter((ev: any) => 
          ev.assignedStaff?.some((staff: any) => 
            staff.userId === currentUser._id || 
            staff.mobileNumber === currentUser.mobileNumber
          )
        );
        return NextResponse.json({ success: true, data: staffEvents });
      }
    }

    if (currentUser.role === 'admin') {
      const events = await Event.find().sort({ date: 1 });
      return NextResponse.json({ success: true, data: events });
    } else {
      // Find events where the logged-in staff is assigned
      const events = await Event.find({
        $or: [
          { 'assignedStaff.userId': currentUser._id },
          { 'assignedStaff.mobileNumber': currentUser.mobileNumber }
        ]
      }).sort({ date: 1 });
      return NextResponse.json({ success: true, data: events });
    }
  } catch (error: any) {
    console.error('GET Events Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create Event (Admin Only)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, date, time, location, category, assignedStaff = [] } = body;

    if (!name || !date || !time || !location || !category) {
      return NextResponse.json({ success: false, error: 'Missing required event fields' }, { status: 400 });
    }

    // Resolve user IDs for assigned staff based on mobile numbers
    const processedStaff = [];
    for (const staff of assignedStaff) {
      let resolvedUserId = null;
      if (global.useMockDb) {
        const { mockDb } = require('@/lib/mockDb');
        const matchedUser = mockDb.users.find((u: any) => u.mobileNumber === staff.mobileNumber && u.role === 'staff');
        if (matchedUser) resolvedUserId = matchedUser._id;
      } else {
        const matchedUser = await User.findOne({ mobileNumber: staff.mobileNumber, role: 'staff' });
        if (matchedUser) resolvedUserId = matchedUser._id;
      }
      processedStaff.push({
        ...staff,
        userId: resolvedUserId
      });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const newEvent = {
        _id: 'event_' + Math.random().toString(36).substring(2, 9),
        name,
        date,
        time,
        location,
        category,
        assignedStaff: processedStaff,
        createdAt: new Date()
      };
      mockDb.events.push(newEvent);
      return NextResponse.json({ success: true, data: newEvent });
    }

    const newEvent = await Event.create({
      name,
      date,
      time,
      location,
      category,
      assignedStaff: processedStaff
    });

    return NextResponse.json({ success: true, data: newEvent });
  } catch (error: any) {
    console.error('POST Event Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Edit Event & Staff Assignment (Admin Only)
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, date, time, location, category, assignedStaff = [] } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    // Resolve user IDs for assigned staff based on mobile numbers
    const processedStaff = [];
    for (const staff of assignedStaff) {
      let resolvedUserId = staff.userId || null;
      if (!resolvedUserId) {
        if (global.useMockDb) {
          const { mockDb } = require('@/lib/mockDb');
          const matchedUser = mockDb.users.find((u: any) => u.mobileNumber === staff.mobileNumber && u.role === 'staff');
          if (matchedUser) resolvedUserId = matchedUser._id;
        } else {
          const matchedUser = await User.findOne({ mobileNumber: staff.mobileNumber, role: 'staff' });
          if (matchedUser) resolvedUserId = matchedUser._id;
        }
      }
      processedStaff.push({
        ...staff,
        userId: resolvedUserId,
        // Preserve existing attendance details if editing
        checkInTime: staff.checkInTime || null,
        checkInLocation: staff.checkInLocation || null,
        checkInSelfie: staff.checkInSelfie || null,
        checkOutTime: staff.checkOutTime || null,
        checkOutLocation: staff.checkOutLocation || null,
        checkOutSelfie: staff.checkOutSelfie || null
      });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.events.findIndex((e: any) => e._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }
      const existing = mockDb.events[index];
      const updatedEvent = {
        ...existing,
        name: name || existing.name,
        date: date || existing.date,
        time: time || existing.time,
        location: location || existing.location,
        category: category || existing.category,
        // Merge staff details (preserving attendance fields for matching staff)
        assignedStaff: processedStaff.map(ps => {
          const matched = existing.assignedStaff?.find((s: any) => s.mobileNumber === ps.mobileNumber);
          if (matched) {
            return {
              ...ps,
              checkInTime: matched.checkInTime || ps.checkInTime,
              checkInLocation: matched.checkInLocation || ps.checkInLocation,
              checkInSelfie: matched.checkInSelfie || ps.checkInSelfie,
              checkOutTime: matched.checkOutTime || ps.checkOutTime,
              checkOutLocation: matched.checkOutLocation || ps.checkOutLocation,
              checkOutSelfie: matched.checkOutSelfie || ps.checkOutSelfie
            };
          }
          return ps;
        })
      };
      mockDb.events[index] = updatedEvent;
      return NextResponse.json({ success: true, data: updatedEvent });
    }

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Merge staff details (preserving attendance fields for matching staff)
    const finalStaff = processedStaff.map(ps => {
      const matched = existingEvent.assignedStaff.find((s: any) => s.mobileNumber === ps.mobileNumber);
      if (matched) {
        return {
          ...ps,
          checkInTime: matched.checkInTime || ps.checkInTime,
          checkInLocation: matched.checkInLocation || ps.checkInLocation,
          checkInSelfie: matched.checkInSelfie || ps.checkInSelfie,
          checkOutTime: matched.checkOutTime || ps.checkOutTime,
          checkOutLocation: matched.checkOutLocation || ps.checkOutLocation,
          checkOutSelfie: matched.checkOutSelfie || ps.checkOutSelfie
        };
      }
      return ps;
    });

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          date,
          time,
          location,
          category,
          assignedStaff: finalStaff
        }
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error: any) {
    console.error('PUT Event Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete Event (Admin Only)
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
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.events.findIndex((e: any) => e._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }
      mockDb.events.splice(index, 1);
      return NextResponse.json({ success: true, message: 'Event deleted' });
    }

    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('DELETE Event Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
