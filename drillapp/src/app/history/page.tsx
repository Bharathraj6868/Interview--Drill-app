'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Attempt {
  id: string;
  drill: {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  score: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session) {
      fetchAttempts();
    }
  }, [session, status, router]);

  const fetchAttempts = async () => {
    try {
      const response = await fetch('/api/attempts?limit=5');
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please sign in to view your history');
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch attempts');
      }
      const data = await response.json();
      setAttempts(data.attempts);
      
      // Show success message if attempts loaded
      if (data.attempts.length > 0) {
        toast.success(`Loaded ${data.attempts.length} recent attempts`);
      }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
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
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              {error.includes('sign in') && (
                <Button onClick={() => router.push('/')} variant="outline">
                  Sign In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Attempt History</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Last 5 Attempts</h2>
          <p className="text-gray-600">Track your progress over time</p>
        </div>

        {attempts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No attempts yet.</p>
              <p className="text-sm text-gray-400 mb-4">Complete a drill to see your history here!</p>
              <Button onClick={() => router.push('/dashboard')}>
                Start Your First Drill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{attempt.drill.title}</CardTitle>
                      <CardDescription>
                        <Badge className={getDifficultyColor(attempt.drill.difficulty)}>
                          {attempt.drill.difficulty}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge className={getScoreColor(attempt.score)}>
                      {attempt.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{formatDate(attempt.createdAt)}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/drill/${attempt.drill.id}`)}
                    >
                      Retry Drill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}