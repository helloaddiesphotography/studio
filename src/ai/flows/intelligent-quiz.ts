'use server';

/**
 * @fileOverview This file contains the Genkit flow for the IntelligentQuiz feature.
 *
 * The IntelligentQuiz flow dynamically tailors quizzes based on the user's performance,
 * prioritizing questions from areas where the user shows less proficiency.
 *
 * - intelligentQuizFlow - The main flow function.
 * - IntelligentQuizInput - The input type for the intelligentQuizFlow.
 * - IntelligentQuizOutput - The output type for the intelligentQuizFlow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  answer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic or category of the question.'),
});

export type Question = z.infer<typeof QuestionSchema>;

const IntelligentQuizInputSchema = z.object({
  userPerformance: z
    .record(z.number())
    .optional()
    .describe(
      'A record of the user performance on each topic. The keys are topics, and the values are performance scores (0-1, where 0 is poor and 1 is perfect).'
    ),
  numberOfQuestions: z
    .number()
    .default(10)
    .describe('The number of questions to generate for the quiz.'),
  allQuestions: z.array(QuestionSchema).describe('All possible questions'),
});

export type IntelligentQuizInput = z.infer<typeof IntelligentQuizInputSchema>;

const IntelligentQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The generated quiz questions.'),
});

export type IntelligentQuizOutput = z.infer<typeof IntelligentQuizOutputSchema>;

export async function generateIntelligentQuiz(input: IntelligentQuizInput): Promise<IntelligentQuizOutput> {
  return intelligentQuizFlow(input);
}

const intelligentQuizPrompt = ai.definePrompt({
  name: 'intelligentQuizPrompt',
  input: {schema: IntelligentQuizInputSchema},
  output: {schema: IntelligentQuizOutputSchema},
  prompt: `You are an expert quiz generator that tailors quizzes based on user performance.

  Prioritize questions from topics where the user has shown less proficiency, as indicated by the userPerformance data. Generate a quiz with {{numberOfQuestions}} questions.

  All possible questions are:
  {{#each allQuestions}}
  - Question: {{this.question}}\n    Answer: {{this.answer}}\n    Topic: {{this.topic}}
  {{/each}}

  User Performance Data (topic: score, where 0 is poor and 1 is perfect): 
  {{#if userPerformance}}
  {{#each userPerformance}}
  - {{@key}}: {{this}}
  {{/each}}
  {{else}}
  No performance data available. Generate a general quiz covering all topics.
  {{/if}}

  Generate a quiz with {{numberOfQuestions}} questions, prioritizing topics where the user has lower scores. If no performance data is available, create a general quiz.

  Ensure that the outputted JSON is valid and can be parsed by Typescript.
  Here's an example of how the output should be formatted:
  {
    "questions": [
      {
        "question": "What is the supreme law of the land?",
        "answer": "The Constitution",
        "topic": "Principles of American Democracy"
      },
      {
        "question": "Who makes federal laws?",
        "answer": "Congress",
        "topic": "Structure of US Government"
      }
    ]
  }
  `,
});

const intelligentQuizFlow = ai.defineFlow(
  {
    name: 'intelligentQuizFlow',
    inputSchema: IntelligentQuizInputSchema,
    outputSchema: IntelligentQuizOutputSchema,
  },
  async input => {
    const {output} = await intelligentQuizPrompt(input);
    return output!;
  }
);
