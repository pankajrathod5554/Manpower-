import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'crewconnect_secret_key';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Get cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenCookie = cookieHeader
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('auth_token='));

    if (!tokenCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const token = tokenCookie.split('=')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const user = mockDb.users.find((u: any) => u._id === decoded.id);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          mobileNumber: user.mobileNumber
        }
      });
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber
      }
    });
  } catch (error: any) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
