'use server';

import { generateIntelligentQuiz, Question } from '@/ai/flows/intelligent-quiz';
import { generateStudyPlan } from '@/ai/flows/personalized-study-plans';
import { UserPerformance } from '@/lib/types';
import { ALL_QUESTIONS } from '@/lib/questions';

export async function startIntelligentQuizAction(
  userPerformance: UserPerformance,
  numberOfQuestions: number = 10
): Promise<Question[]> {
  try {
    const performanceScores = Object.entries(userPerformance).reduce(
      (acc, [topic, data]) => {
        acc[topic] = data.score;
        return acc;
      },
      {} as Record<string, number>
    );

    const result = await generateIntelligentQuiz({
      userPerformance: performanceScores,
      numberOfQuestions,
      allQuestions: ALL_QUESTIONS,
    });

    return result.questions;
  } catch (error) {
    console.error('Error generating intelligent quiz:', error);
    // Fallback to random questions if AI fails
    const shuffled = ALL_QUESTIONS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfQuestions);
  }
}

export async function generateStudyPlanAction(
  timeline: string,
  learningPreferences: string
): Promise<string> {
  try {
    const result = await generateStudyPlan({
      timeline,
      learningPreferences,
    });
    return result.studyPlan;
  } catch (error) {
    console.error('Error generating study plan:', error);
    return 'There was an error generating your study plan. Please try again later.';
  }
}
