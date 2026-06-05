import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import { User, WorkerProfile } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'crewconnect_secret_key';

// Helper to seed demo users if they don't exist
async function ensureDemoUsers() {
  const demoUsers = [
    {
      email: 'employer@crewconnect.com',
      password: 'password123',
      fullName: 'John Planners (Elite Weddings)',
      mobileNumber: '+91 98765 43210',
      role: 'employer'
    },
    {
      email: 'worker@crewconnect.com',
      password: 'password123',
      fullName: 'Rahul Sharma (VIP Staff)',
      mobileNumber: '+91 99999 88888',
      role: 'worker'
    },
    {
      email: 'admin@crewconnect.com',
      password: 'password123',
      fullName: 'CrewConnect Admin System',
      mobileNumber: '+91 90000 11111',
      role: 'admin'
    },
    {
      email: 'superadmin@crewconnect.com',
      password: 'password123',
      fullName: 'System Super Admin',
      mobileNumber: '+91 99999 00000',
      role: 'superadmin'
    },
    {
      email: 'manager@crewconnect.com',
      password: 'password123',
      fullName: 'Staff Manager (Operations)',
      mobileNumber: '+91 98888 77777',
      role: 'staff_manager'
    }
  ];

  for (const demo of demoUsers) {
    const exists = await User.findOne({ email: demo.email });
    if (!exists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(demo.password, salt);
      const created = await User.create({
        email: demo.email,
        passwordHash,
        role: demo.role,
        fullName: demo.fullName,
        mobileNumber: demo.mobileNumber
      });

      if (demo.role === 'worker') {
        await WorkerProfile.create({
          userId: created._id,
          bio: 'Polished front-desk coordinator and billing supervisor with 4+ years of wedding hospitality experience.',
          experienceYears: '4',
          skills: ['Reception', 'Billing', 'Guest Relations', 'Fluent English', 'QR Ticketing'],
          rating: 4.9,
          completedJobsCount: 14,
          isVerified: true,
          prevEvents: ['MEB Energy Summit 2025', 'Ultra Luxe Wedding Ahmedabad 2026']
        });
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const { email, password } = await req.json();
      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
      }
      const normalizedEmail = email.toLowerCase();
      const user = mockDb.users.find((u: any) => u.email === normalizedEmail);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 400 });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      const response = NextResponse.json({
        success: true,
        message: 'Login successful (Mock Mode)',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }
      });
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      return response;
    }

    // Seed demo accounts automatically
    await ensureDemoUsers();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 400 });
    }

    // Sign token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
