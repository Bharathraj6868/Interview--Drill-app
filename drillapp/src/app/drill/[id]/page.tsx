'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import SuccessAlert from '@/components/SuccessAlert';

interface Question {
  id: string;
  prompt: string;
  keywords: string[];
}

interface Drill {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  questions: Question[];
}

interface Answer {
  qid: string;
  text: string;
}

export default function DrillPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const drillId = params.id as string;

  const [drill, setDrill] = useState<Drill | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session && drillId) {
      fetchDrill();
    }
  }, [session, status, router, drillId]);

  const fetchDrill = async () => {
    try {
      const response = await fetch(`/api/drills/${drillId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch drill');
      }
      const data = await response.json();
      setDrill(data);
      
      // Initialize answers
      setAnswers(data.questions.map((q: Question) => ({
        qid: q.id,
        text: ''
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qid: string, text: string) => {
    setAnswers(prev => prev.map(a => a.qid === qid ? { ...a, text } : a));
  };

  const handleSubmit = async () => {
    if (!drill) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drillId: drill.id,
          answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit attempt');
      }

      const result = await response.json();
      
      // Set score and show success alert
      setScore(result.score);
      setShowSuccess(true);
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit drill');
    } finally {
      setSubmitting(false);
    }
  };

  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!drill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Drill not found</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Alert Overlay */}
      {showSuccess && (
        <SuccessAlert 
          score={score} 
          onRedirect={() => router.push('/dashboard')} 
        />
      )}
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{drill.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(drill.difficulty)}>
                  {drill.difficulty}
                </Badge>
                <div className="flex gap-1">
                  {drill.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

        <main className="max-w-4xl mx-auto p-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Answer all 5 questions below. Your answers will be scored based on keyword matching.
            </p>
          </div>

          <div className="space-y-6">
            {drill.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">{question.prompt}</p>
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers.find(a => a.qid === question.id)?.text || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">
                      Keywords to consider: {question.keywords.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting || answers.some(a => !a.text.trim())}
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}