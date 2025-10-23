'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized study plans
 * based on user's individual timeline and learning preferences.
 *
 * @remarks
 * - `generateStudyPlan` - A function that takes user preferences and generates a study plan.
 * - `StudyPlanInput` - The input type for the `generateStudyPlan` function.
 * - `StudyPlanOutput` - The output type for the `generateStudyPlan` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlanInputSchema = z.object({
  timeline: z
    .string()
    .describe('The user provided timeline for studying, e.g., 2 weeks, 1 month.'),
  learningPreferences: z
    .string()
    .describe(
      'The user provided learning preferences, e.g., visual aids, flashcards, practice tests.'
    ),
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

const StudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A personalized study plan based on the user input.'),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;

export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyPlanPrompt',
  input: {schema: StudyPlanInputSchema},
  output: {schema: StudyPlanOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized study plans for the US civics test.

  Based on the user's timeline and learning preferences, create a detailed study plan to help them prepare for the test.

  Timeline: {{{timeline}}}
  Learning Preferences: {{{learningPreferences}}}

  Study Plan:
  `, // Ensure there is no extra whitespace at the beginning
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
