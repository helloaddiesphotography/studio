'use client';

import React, { useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { UserPerformance } from '@/lib/types';
import { TOPICS } from '@/lib/questions';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '../ui/button';

const getInitialPerformance = (): UserPerformance => {
    const performance: UserPerformance = {};
    TOPICS.forEach(topic => {
      performance[topic] = { correct: 0, total: 0, score: 0 };
    });
    return performance;
};

export default function ProgressTracker() {
  const [performance, setPerformance] = useLocalStorage<UserPerformance>('civics-performance', getInitialPerformance());

  const chartData = useMemo(() => {
    return Object.entries(performance)
      .map(([topic, data]) => ({
        topic,
        score: Math.round(data.score * 100),
        correct: data.correct,
        total: data.total,
      }))
      .sort((a, b) => a.score - b.score);
  }, [performance]);

  const totalQuestionsAnswered = useMemo(() => {
    return Object.values(performance).reduce((sum, topic) => sum + topic.total, 0);
  }, [performance]);

  const overallScore = useMemo(() => {
    const totalCorrect = Object.values(performance).reduce((sum, topic) => sum + topic.correct, 0);
    if (totalQuestionsAnswered === 0) return 0;
    return Math.round((totalCorrect / totalQuestionsAnswered) * 100);
  }, [performance, totalQuestionsAnswered]);

  const resetProgress = () => {
    if(window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")){
        setPerformance(getInitialPerformance());
    }
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{overallScore}%</div>
                <p className="text-xs text-muted-foreground">Based on all questions answered</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Questions Answered</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalQuestionsAnswered}</div>
                <p className="text-xs text-muted-foreground">Across all topics</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Topics Practiced</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{Object.values(performance).filter(t => t.total > 0).length} / {TOPICS.length}</div>
                <p className="text-xs text-muted-foreground">Number of topics attempted</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reset Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={resetProgress}>Reset All Data</Button>
                <p className="text-xs text-muted-foreground mt-2">Start fresh by clearing all stats</p>
            </CardContent>
            </Card>
        </div>


      <Card>
        <CardHeader>
          <CardTitle>Performance by Topic</CardTitle>
          <CardDescription>
            Your proficiency score for each category. Use the Intelligent Quiz to improve your weak areas!
          </CardDescription>
        </CardHeader>
        <CardContent>
            {totalQuestionsAnswered > 0 ? (
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                            dataKey="topic"
                            type="category"
                            width={150}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--secondary))' }}
                            content={<ChartTooltipContent
                                formatter={(value, name, props) => (
                                    <div className="flex flex-col">
                                        <span className="font-bold">{props.payload.topic}</span>
                                        <span>Score: {value}%</span>
                                        <span className="text-xs text-muted-foreground">({props.payload.correct} / {props.payload.total} correct)</span>
                                    </div>
                                )}
                                hideLabel
                            />}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <rect key={`cell-${index}`} fill={entry.score < 50 ? "hsl(var(--accent))" : "hsl(var(--primary))"} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[400px] flex items-center justify-center text-center text-muted-foreground">
                    <p>No progress data yet. <br/> Take a quiz to see your performance here.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
