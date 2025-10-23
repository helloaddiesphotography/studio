'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStudyPlanAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  timeline: z.string().min(2, {
    message: 'Timeline must be at least 2 characters.',
  }),
  learningPreferences: z.string().min(5, {
    message: 'Please describe your learning preferences.',
  }),
});

export default function StudyPlanGenerator() {
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeline: '4 weeks',
      learningPreferences: 'I prefer visual aids like charts and videos, and I learn best by taking practice tests.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStudyPlan(null);
    try {
      const plan = await generateStudyPlanAction(values.timeline, values.learningPreferences);
      setStudyPlan(plan);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Generating Plan",
            description: "There was a problem creating your study plan. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary"/>
                Personalized Study Plan Generator
            </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Timeline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 weeks, 1 month" {...field} />
                    </FormControl>
                    <FormDescription>
                      How long do you have to prepare for the test?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="learningPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., flashcards, watching videos, practice tests..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How do you like to study?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold">Our AI is crafting your plan...</p>
          <p className="text-muted-foreground">This might take a moment.</p>
        </div>
      )}

      {studyPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Custom Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-primary dark:prose-invert">
              {studyPlan.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
