export type Mode = 'add' | 'sub' | 'mixed';
export type Level = 1 | 2 | 3;
export type Op = '+' | '-';

export type Skill =
  | 'make-ten'
  | 'doubles'
  | 'near-doubles'
  | 'within-20'
  | 'no-carry'
  | 'carry'
  | 'no-borrow'
  | 'borrow'
  | 'missing';

export type Strategy = 'ten-frame' | 'number-line' | 'base-ten-add' | 'base-ten-sub' | 'bar-model';

export interface Question {
  a: number;
  b: number;
  op: Op;
  /** the visible right-hand side when the second operand is the unknown */
  result: number;
  missing: 'result' | 'b';
  answer: number;
  level: Level;
  skill: Skill;
  strategy: Strategy;
  key: string;
}

export interface AnswerRecord {
  firstTry: boolean;
  attempts: number;
  usedHint: boolean;
  ms: number;
}

export interface QuizConfig {
  mode: Mode;
  level: Level;
  count: number;
}

export interface Session extends QuizConfig {
  seed: number;
  baseLevel: Level;
  startedAt: number;
  level: Level;
  index: number;
  questions: Question[];
  records: AnswerRecord[];
  streakCorrect: number;
  streakWrong: number;
}

export interface Summary {
  total: number;
  firstTryCorrect: number;
  stars: 1 | 2 | 3;
  ms: number;
  bestStreak: number;
  level: Level;
  config: QuizConfig;
}
