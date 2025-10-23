export interface Question {
  id: number;
  question: string;
  answer: string;
  topic: string;
}

export interface UserPerformance {
  [topic: string]: {
    correct: number;
    total: number;
    score: number;
  };
}
