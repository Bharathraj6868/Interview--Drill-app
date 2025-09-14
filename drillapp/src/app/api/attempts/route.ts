import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User, Attempt } from '@/models';
import connectDB from '@/lib/mongodb';
import { z } from 'zod';

const submitAttemptSchema = z.object({
  drillId: z.string(),
  answers: z.array(z.object({
    qid: z.string(),
    text: z.string()
  }))
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    await connectDB();
    
    const attempts = await Attempt.find({ userId: session.user.id })
      .populate('drillId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      attempts: attempts.map(attempt => ({
        id: attempt._id,
        drill: {
          id: attempt.drillId._id,
          title: attempt.drillId.title,
          difficulty: attempt.drillId.difficulty
        },
        score: attempt.score,
        createdAt: attempt.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = submitAttemptSchema.parse(body);

    await connectDB();
    
    // Get the drill to calculate score
    const drill = await Drill.findById(validatedData.drillId);
    if (!drill) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Drill not found' } }, { status: 404 });
    }

    // Calculate score based on keyword matching
    let totalKeywords = 0;
    let matchedKeywords = 0;

    const scoreDetails = validatedData.answers.map(answer => {
      const question = drill.questions.find(q => q.id === answer.qid);
      if (!question) {
        return { qid: answer.qid, score: 0, details: 'Question not found' };
      }

      const questionKeywords = question.keywords;
      totalKeywords += questionKeywords.length;

      const answerText = answer.text.toLowerCase();
      const matched = questionKeywords.filter(keyword => 
        answerText.includes(keyword.toLowerCase())
      );

      matchedKeywords += matched.length;

      return {
        qid: answer.qid,
        score: matched.length,
        total: questionKeywords.length,
        details: `Matched ${matched.length} of ${questionKeywords.length} keywords`
      };
    });

    const score = totalKeywords > 0 ? Math.round((matchedKeywords / totalKeywords) * 100) : 0;

    // Create attempt
    const attempt = await Attempt.create({
      userId: session.user.id,
      drillId: validatedData.drillId,
      answers: validatedData.answers,
      score
    });

    return NextResponse.json({
      id: attempt._id,
      score,
      details: scoreDetails
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid input data',
          details: error.errors 
        } 
      }, { status: 400 });
    }

    console.error('Error submitting attempt:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}