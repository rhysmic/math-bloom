import { describe, expect, it } from 'vitest';
import { nextQuestion } from '../src/game/questions';
import type { Level, Mode, Question } from '../src/game/types';

function buildQuiz(level: Level, mode: Mode, count = 20): Question[] {
  const used = new Set<string>();
  const answers = new Map<number, number>();
  const questions: Question[] = [];
  for (let i = 0; i < count; i += 1) {
    const q = nextQuestion(2024, i, level, mode, used, answers);
    used.add(q.key);
    answers.set(q.answer, (answers.get(q.answer) ?? 0) + 1);
    questions.push(q);
  }
  return questions;
}

describe('question generator', () => {
  it('builds level 1 questions within 20', () => {
    const questions = buildQuiz(1, 'mixed', 30);
    for (const q of questions) {
      expect(q.a).toBeGreaterThanOrEqual(2);
      expect(q.b).toBeGreaterThanOrEqual(2);
      expect(q.result).toBeLessThanOrEqual(18);
      expect(q.answer).toBeGreaterThanOrEqual(2);
    }
    expect(questions.some((q) => q.op === '+')).toBe(true);
    expect(questions.some((q) => q.op === '-')).toBe(true);
  });

  it('builds level 2 questions with two-digit operands and no regrouping', () => {
    const questions = buildQuiz(2, 'add', 24).filter((q) => q.missing === 'result');
    for (const q of questions) {
      expect(q.a).toBeGreaterThanOrEqual(11);
      expect(q.b).toBeGreaterThanOrEqual(11);
      expect(q.a + q.b).toBeLessThanOrEqual(99);
      expect((q.a % 10) + (q.b % 10)).toBeLessThanOrEqual(9);
    }
  });

  it('builds level 3 addition that always carries', () => {
    const questions = buildQuiz(3, 'add', 24).filter((q) => q.op === '+' && q.missing === 'result');
    for (const q of questions) {
      expect((q.a % 10) + (q.b % 10)).toBeGreaterThanOrEqual(10);
      expect(q.a + q.b).toBeLessThanOrEqual(100);
    }
  });

  it('builds level 3 subtraction that always borrows with a positive result', () => {
    const questions = buildQuiz(3, 'sub', 24).filter((q) => q.missing === 'result');
    for (const q of questions) {
      expect(q.a % 10).toBeLessThan(q.b % 10);
      expect(q.a).toBeGreaterThan(q.b);
    }
  });

  it('keeps every question in a quiz distinct', () => {
    const questions = buildQuiz(3, 'mixed', 20);
    expect(new Set(questions.map((q) => q.key)).size).toBe(20);
  });

  it('caps repeated answers at two', () => {
    const questions = buildQuiz(2, 'mixed', 20);
    const counts = new Map<number, number>();
    for (const q of questions) {
      const n = (counts.get(q.answer) ?? 0) + 1;
      counts.set(q.answer, n);
      expect(n).toBeLessThanOrEqual(2);
    }
  });

  it('includes missing-operand questions at level 2', () => {
    const questions = buildQuiz(2, 'add', 30);
    expect(questions.some((q) => q.missing === 'b')).toBe(true);
  });
});
