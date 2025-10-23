'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { startIntelligentQuizAction } from '@/app/actions';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Question, UserPerformance } from '@/lib/types';
import { ALL_QUESTIONS, TOPICS } from '@/lib/questions';
import { Progress } from '../ui/progress';

type QuizState = 'idle' | 'loading' | 'active' | 'finished';

const getInitialPerformance = (): UserPerformance => {
  const performance: UserPerformance = {};
  TOPICS.forEach(topic => {
    performance[topic] = { correct: 0, total: 0, score: 0 };
  });
  return performance;
};

export default function IntelligentQuiz() {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [performance, setPerformance] = useLocalStorage<UserPerformance>('civics-performance', getInitialPerformance());
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);

  const startQuiz = useCallback(async () => {
    setQuizState('loading');
    setShowAnswer(false);
    setCurrentIndex(0);
    setSessionCorrect(0);
    setAnswerStatus(null);
    const quizQuestions = await startIntelligentQuizAction(performance);
    setQuestions(quizQuestions);
    setQuizState('active');
  }, [performance]);

  const handleAnswer = (isCorrect: boolean) => {
    if (answerStatus) return; // Prevent multiple clicks
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
        const currentQuestion = questions[currentIndex];
        if (currentQuestion) {
            setPerformance(prev => {
                const newPerformance = { ...prev };
                const topicData = newPerformance[currentQuestion.topic] || { correct: 0, total: 0, score: 0 };
                
                const newCorrect = topicData.correct + (isCorrect ? 1 : 0);
                const newTotal = topicData.total + 1;
                
                newPerformance[currentQuestion.topic] = {
                    correct: newCorrect,
                    total: newTotal,
                    score: newTotal > 0 ? newCorrect / newTotal : 0
                };
                return newPerformance;
            });
            if (isCorrect) {
              setSessionCorrect(prev => prev + 1);
            }
        }
    
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
            setAnswerStatus(null);
        } else {
            setQuizState('finished');
        }
    }, 1000);
  };
  
  if (quizState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <Sparkles className="text-primary" />
                    AI-Powered Intelligent Quiz
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">
                Test your knowledge with a quiz tailored to your performance. The AI will focus on topics where you need the most practice.
                </p>
                <Button onClick={startQuiz} size="lg">Start Quiz</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generating your personalized quiz...</p>
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold mb-2">
                    {((sessionCorrect / questions.length) * 100).toFixed(0)}%
                </p>
                <p className="text-muted-foreground mb-6">
                    You answered {sessionCorrect} out of {questions.length} questions correctly.
                </p>
                <Button onClick={startQuiz} size="lg">Take Another Quiz</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <CardTitle>Question {currentIndex + 1} of {questions.length}</CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">{currentQuestion?.topic}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold min-h-[6rem]">{currentQuestion?.question}</p>
                        
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 p-4 bg-secondary rounded-md"
                            >
                                <p className="font-bold">{currentQuestion?.answer}</p>
                            </motion.div>
                        )}
                    </CardContent>
                     {answerStatus && (
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0}}
                            animate={{ scale: 1, opacity: 1}}
                            className={`absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm`}>
                            {answerStatus === 'correct' ? <Check className="size-24 text-green-500" /> : <X className="size-24 text-red-500" />}
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </AnimatePresence>
      </div>
        <div className="w-full max-w-2xl space-y-4">
             <Progress value={((currentIndex + 1) / questions.length) * 100} className="flex-1"/>
            {showAnswer ? (
                <div className="flex justify-center items-center gap-4">
                <Button onClick={() => handleAnswer(false)} variant="destructive" className="w-40" disabled={!!answerStatus}>
                    <X className="mr-2 h-4 w-4" /> I was wrong
                </Button>
                <Button onClick={() => handleAnswer(true)} className="w-40 bg-green-600 hover:bg-green-700" disabled={!!answerStatus}>
                    <Check className="mr-2 h-4 w-4" /> I was right
                </Button>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Button onClick={() => setShowAnswer(true)} className="w-48">Reveal Answer</Button>
                </div>
            )}
        </div>
    </div>
  );
}
