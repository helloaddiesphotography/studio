'use client';

import React, { useState } from 'react';
import { ALL_QUESTIONS } from '@/lib/questions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ALL_QUESTIONS.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? ALL_QUESTIONS.length - 1 : prevIndex - 1
        );
    }, 150);
  };

  const currentQuestion = ALL_QUESTIONS[currentIndex];

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
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{currentIndex + 1} / {ALL_QUESTIONS.length}</span>
            <Progress value={((currentIndex + 1) / ALL_QUESTIONS.length) * 100} className="flex-1"/>
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
