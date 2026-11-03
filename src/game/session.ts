import type { AnswerRecord, Question, QuizConfig, Session } from './types';
import { nextQuestion } from './questions';
import { nextWorkingLevel } from './score';

export function createSession(config: QuizConfig, seed = Math.floor(Date.now() % 2_000_000_000)): Session {
  const session: Session = {
    ...config,
    seed,
    startedAt: Date.now(),
    baseLevel: config.level,
    level: config.level,
    index: 0,
    questions: [],
    records: [],
    streakCorrect: 0,
    streakWrong: 0,
  };
  return withNextQuestion(session);
}

export function withNextQuestion(session: Session): Session {
  if (session.index >= session.count) return session;
  if (session.questions[session.index]) return session;

  const used = new Set(session.questions.map((q) => q.key));
  const answers = new Map<number, number>();
  for (const q of session.questions) {
    if (!q) continue;
    answers.set(q.answer, (answers.get(q.answer) ?? 0) + 1);
  }

  const question = nextQuestion(session.seed, session.index, session.level, session.mode, used, answers);
  const questions = [...session.questions];
  questions[session.index] = question;
  return { ...session, questions };
}

export function currentQuestion(session: Session): Question | null {
  return session.questions[session.index] ?? null;
}

export function recordAnswer(session: Session, record: AnswerRecord): Session {
  if (!currentQuestion(session)) throw new Error('No current question');
  const ramp = nextWorkingLevel(
    session.level,
    session.baseLevel,
    record.firstTry,
    session.streakCorrect,
    session.streakWrong,
  );
  const next: Session = {
    ...session,
    level: ramp.level,
    streakCorrect: ramp.streakCorrect,
    streakWrong: ramp.streakWrong,
    records: [...session.records, record],
    index: session.index + 1,
  };
  return withNextQuestion(next);
}

export function isFinished(session: Session): boolean {
  return session.index >= session.count;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
