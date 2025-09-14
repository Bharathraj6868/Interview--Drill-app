import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Drill } from '@/models';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const cacheKey = 'drills-list';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    await connectDB();
    
    const drills = await Drill.find({})
      .select('title difficulty tags')
      .sort({ createdAt: -1 })
      .lean();

    const data = {
      drills: drills.map(drill => ({
        id: drill._id,
        title: drill.title,
        difficulty: drill.difficulty,
        tags: drill.tags
      }))
    };

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching drills:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}