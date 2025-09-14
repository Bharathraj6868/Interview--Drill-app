import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';
import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id).select('-providers');
    
    if (!user) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'User not found' } }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}