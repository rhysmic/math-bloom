import { describe, expect, it } from 'vitest';
import { buildSummary, nextWorkingLevel, starsFor } from '../src/game/score';
import type { AnswerRecord } from '../src/game/types';
import type { RampResult } from '../src/game/score';

const record = (firstTry: boolean): AnswerRecord => ({
  firstTry,
  attempts: firstTry ? 1 : 2,
  usedHint: false,
  ms: 4000,
});

describe('scoring', () => {
  it('gives three stars for a perfect quiz', () => {
    expect(starsFor(15, 15)).toBe(3);
  });

  it('gives two stars for a solid quiz', () => {
    expect(starsFor(12, 15)).toBe(2);
  });

  it('summarises a perfect quiz', () => {
    const records = Array.from({ length: 15 }, () => record(true));
    const summary = buildSummary(records, 15, 2, { mode: 'mixed', level: 2, count: 15 });
    expect(summary.firstTryCorrect).toBe(15);
    expect(summary.stars).toBe(3);
    expect(summary.bestStreak).toBe(15);
    expect(summary.ms).toBe(60000);
  });
});

describe('adaptive level', () => {
  it('steps up after three first-try wins in a row', () => {
    let state: RampResult = { level: 2, streakCorrect: 0, streakWrong: 0 };
    state = nextWorkingLevel(state.level, 2, true, state.streakCorrect, state.streakWrong);
    state = nextWorkingLevel(state.level, 2, true, state.streakCorrect, state.streakWrong);
    state = nextWorkingLevel(state.level, 2, true, state.streakCorrect, state.streakWrong);
    expect(state.level).toBe(3);
  });

  it('steps down after two misses in a row', () => {
    let state: RampResult = { level: 3, streakCorrect: 0, streakWrong: 0 };
    state = nextWorkingLevel(state.level, 3, false, state.streakCorrect, state.streakWrong);
    state = nextWorkingLevel(state.level, 3, false, state.streakCorrect, state.streakWrong);
    expect(state.level).toBe(2);
  });

  it('never drops below the chosen level minus one', () => {
    let state: RampResult = { level: 2, streakCorrect: 0, streakWrong: 0 };
    state = nextWorkingLevel(state.level, 2, false, state.streakCorrect, state.streakWrong);
    state = nextWorkingLevel(state.level, 2, false, state.streakCorrect, state.streakWrong);
    expect(state.level).toBe(1);
  });
});
