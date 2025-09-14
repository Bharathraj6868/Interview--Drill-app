'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

interface SuccessAlertProps {
  score: number;
  onRedirect: () => void;
}

export default function SuccessAlert({ score, onRedirect }: SuccessAlertProps) {
  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🏆";
    if (score >= 80) return "Excellent! 🌟";
    if (score >= 70) return "Great job! 👍";
    if (score >= 60) return "Good effort! 👏";
    return "Keep practicing! 💪";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {getScoreMessage(score)}
          </h3>
          
          <div className="mb-4">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            <p className="text-gray-600 mt-1">Your Score</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to dashboard automatically...
          </p>
          
          <button 
            onClick={onRedirect}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard Now
          </button>
        </CardContent>
      </Card>
    </div>
  );
}