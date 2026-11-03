import type { AnswerRecord, Level, Summary } from './types';

export function starsFor(correct: number, total: number): 1 | 2 | 3 {
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export interface RampResult {
  level: Level;
  streakCorrect: number;
  streakWrong: number;
}

/** Three first-try wins in a row nudge the level up, two misses nudge it down. */
export function nextWorkingLevel(
  current: Level,
  base: Level,
  correct: boolean,
  streakCorrect: number,
  streakWrong: number,
): RampResult {
  const minLevel = Math.max(1, base - 1) as Level;
  const maxLevel = Math.min(3, base + 1) as Level;

  if (correct) {
    const streak = streakCorrect + 1;
    if (streak >= 3 && current < maxLevel) {
      return { level: (current + 1) as Level, streakCorrect: 0, streakWrong: 0 };
    }
    return { level: current, streakCorrect: streak, streakWrong: 0 };
  }

  const streak = streakWrong + 1;
  if (streak >= 2 && current > minLevel) {
    return { level: (current - 1) as Level, streakCorrect: 0, streakWrong: 0 };
  }
  return { level: current, streakCorrect: 0, streakWrong: streak };
}

export function bestStreak(records: readonly AnswerRecord[]): number {
  let best = 0;
  let run = 0;
  for (const record of records) {
    if (record.firstTry) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  return best;
}

export function buildSummary(records: readonly AnswerRecord[], total: number, level: Level, config: Summary['config']): Summary {
  const firstTryCorrect = records.filter((r) => r.firstTry).length;
  return {
    total,
    firstTryCorrect,
    stars: starsFor(firstTryCorrect, total),
    ms: records.reduce((sum, r) => sum + r.ms, 0),
    bestStreak: bestStreak(records),
    level,
    config,
  };
}
