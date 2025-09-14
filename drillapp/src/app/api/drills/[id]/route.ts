import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Drill } from '@/models';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const drill = await Drill.findById(params.id).lean();
    
    if (!drill) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Drill not found' } }, { status: 404 });
    }

    return NextResponse.json({
      id: drill._id,
      title: drill.title,
      difficulty: drill.difficulty,
      tags: drill.tags,
      questions: drill.questions
    });
  } catch (error) {
    console.error('Error fetching drill:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}