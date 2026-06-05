import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      return NextResponse.json({ success: true, data: mockDb.users }, { status: 200 });
    }

    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    console.error('GET Users Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role, fullName, mobileNumber } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const userIndex = mockDb.users.findIndex((u: any) => u._id === id);
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      
      const updated = {
        ...mockDb.users[userIndex],
        ...(role && { role }),
        ...(fullName && { fullName }),
        ...(mobileNumber && { mobileNumber })
      };
      mockDb.users[userIndex] = updated;
      
      const { passwordHash, ...rest } = updated;
      return NextResponse.json({ success: true, data: rest }, { status: 200 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (fullName) updateData.fullName = fullName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('PUT User Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();

    if (!currentUser || currentUser.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Only Super Admins can delete users' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const index = mockDb.users.findIndex((u: any) => u._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      mockDb.users.splice(index, 1);
      return NextResponse.json({ success: true, message: 'User deleted' }, { status: 200 });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE User Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
