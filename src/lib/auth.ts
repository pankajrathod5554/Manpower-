import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './db';
import { User } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'crewconnect_secret_key';

export async function getAuthUser() {
  await dbConnect();
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return null;

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const user = mockDb.users.find((u: any) => u._id === decoded.id);
      if (!user) return null;
      // Return user object excluding passwordHash
      const { passwordHash, ...rest } = user;
      return rest;
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    return user;
  } catch (error) {
    return null;
  }
}
