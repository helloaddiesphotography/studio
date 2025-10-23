'use client';

import React, { useState, useEffect } from 'react';
import { ALL_QUESTIONS } from '@/lib/questions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [questions, setQuestions] = useState(ALL_QUESTIONS);

  useEffect(() => {
    let newQuestions = [...ALL_QUESTIONS];
    if (isRandomized) {
      // Fisher-Yates shuffle algorithm
      for (let i = newQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQuestions[i], newQuestions[j]] = [newQuestions[j], newQuestions[i]];
      }
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [isRandomized]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? questions.length - 1 : prevIndex - 1
        );
    }, 150);
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return null; // or a loading state
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      <div className="w-full max-w-2xl">
        <div 
          className="relative w-full aspect-[2/1] [transform-style:preserve-3d] transition-transform duration-500"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of the card */}
          <Card className="absolute w-full h-full flex items-center justify-center p-6 cursor-pointer [backface-visibility:hidden]">
            <CardContent className="p-0 text-center">
              <p className="text-sm text-muted-foreground">Question {currentQuestion.id}</p>
              <p className="text-xl md:text-2xl font-semibold mt-2">{currentQuestion.question}</p>
            </CardContent>
          </Card>
          {/* Back of the card */}
          <Card className="absolute w-full h-full flex items-center justify-center p-6 cursor-pointer [backface-visibility:hidden] [transform:rotateY(180deg)] bg-secondary">
            <CardContent className="p-0 text-center">
                <p className="text-sm text-muted-foreground">Answer</p>
                <p className="text-xl md:text-2xl font-semibold mt-2">{currentQuestion.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
                <Switch 
                    id="randomize-switch"
                    checked={isRandomized}
                    onCheckedChange={setIsRandomized}
                />
                <Label htmlFor="randomize-switch">Randomize</Label>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{currentIndex + 1} / {questions.length}</span>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="flex-1"/>
        </div>
        <div className="flex justify-center items-center gap-4">
            <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous question</span>
            </Button>
            <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)}>
                <RotateCw className="mr-2 h-4 w-4" />
                Flip Card
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next question</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
