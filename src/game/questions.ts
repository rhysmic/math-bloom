import type { Level, Mode, Op, Question, Skill, Strategy } from './types';
import { hashSeed, mulberry32, randInt, type Rand } from './rng';

interface Blueprint {
  a: number;
  b: number;
  op: Op;
  missing: 'result' | 'b';
  level: Level;
  skill: Skill;
  strategy: Strategy;
}

function build(bp: Blueprint): Question {
  const result = bp.op === '+' ? bp.a + bp.b : bp.a - bp.b;
  const answer = bp.missing === 'b' ? bp.b : result;
  return {
    ...bp,
    result,
    answer,
    key: `${bp.a}${bp.op}${bp.b}${bp.missing === 'b' ? '?' : ''}`,
  };
}

type Maker = (rand: Rand) => Blueprint | null;

const makeTen: Maker = (rand) => {
  const a = randInt(rand, 6, 9);
  const lo = Math.max(2, 11 - a);
  const hi = Math.min(9, 18 - a);
  if (lo > hi) return null;
  return {
    a,
    b: randInt(rand, lo, hi),
    op: '+',
    missing: 'result',
    level: 1,
    skill: 'make-ten',
    strategy: 'ten-frame',
  };
};

const doubles: Maker = (rand) => {
  const a = randInt(rand, 3, 9);
  return {
    a,
    b: a,
    op: '+',
    missing: 'result',
    level: 1,
    skill: 'doubles',
    strategy: 'ten-frame',
  };
};

const nearDoubles: Maker = (rand) => {
  const a = randInt(rand, 3, 8);
  return {
    a,
    b: a + 1,
    op: '+',
    missing: 'result',
    level: 1,
    skill: 'near-doubles',
    strategy: 'ten-frame',
  };
};

const plainAdd: Maker = (rand) => {
  const a = randInt(rand, 2, 9);
  const b = randInt(rand, 2, 9);
  if (a + b < 8) return null;
  return {
    a,
    b,
    op: '+',
    missing: 'result',
    level: 1,
    skill: 'within-20',
    strategy: 'ten-frame',
  };
};

const crossTenSubtract: Maker = (rand) => {
  const a = randInt(rand, 11, 18);
  const b = randInt(rand, 2, 9);
  if (a - b < 2 || a - b > 9) return null;
  return {
    a,
    b,
    op: '-',
    missing: 'result',
    level: 1,
    skill: 'within-20',
    strategy: 'number-line',
  };
};

const plainSubtract: Maker = (rand) => {
  const a = randInt(rand, 6, 18);
  const b = randInt(rand, 2, Math.min(9, a - 3));
  return {
    a,
    b,
    op: '-',
    missing: 'result',
    level: 1,
    skill: 'within-20',
    strategy: 'number-line',
  };
};

/** Two-digit + two-digit that stays in the same ten (no regrouping). */
const addNoCarry: Maker = (rand) => {
  const t1 = randInt(rand, 1, 7);
  const t2 = randInt(rand, 1, 9 - t1);
  const u1 = randInt(rand, 1, 8);
  const u2 = randInt(rand, 1, 9 - u1);
  const a = t1 * 10 + u1;
  const b = t2 * 10 + u2;
  return {
    a,
    b,
    op: '+',
    missing: 'result',
    level: 2,
    skill: 'no-carry',
    strategy: 'base-ten-add',
  };
};

const subtractNoBorrow: Maker = (rand) => {
  const t1 = randInt(rand, 3, 9);
  const t2 = randInt(rand, 1, t1 - 1);
  const u1 = randInt(rand, 0, 9);
  const u2 = randInt(rand, 0, u1);
  const a = t1 * 10 + u1;
  const b = t2 * 10 + u2;
  if (a - b < 10) return null;
  return {
    a,
    b,
    op: '-',
    missing: 'result',
    level: 2,
    skill: 'no-borrow',
    strategy: 'base-ten-sub',
  };
};

const missingWithinTwenty: Maker = (rand) => {
  const a = randInt(rand, 5, 9);
  const lo = Math.max(3, 11 - a);
  const hi = Math.min(9, 18 - a);
  if (lo > hi) return null;
  const b = randInt(rand, lo, hi);
  return {
    a,
    b,
    op: '+',
    missing: 'b',
    level: 2,
    skill: 'missing',
    strategy: 'bar-model',
  };
};

const addWithCarry: Maker = (rand) => {
  const t1 = randInt(rand, 1, 7);
  const t2 = randInt(rand, 1, 8 - t1);
  const u1 = randInt(rand, 2, 9);
  const u2 = randInt(rand, 10 - u1, 9);
  const a = t1 * 10 + u1;
  const b = t2 * 10 + u2;
  if (a + b > 100) return null;
  return {
    a,
    b,
    op: '+',
    missing: 'result',
    level: 3,
    skill: 'carry',
    strategy: 'base-ten-add',
  };
};

const subtractWithBorrow: Maker = (rand) => {
  const t1 = randInt(rand, 3, 9);
  const t2 = randInt(rand, 1, t1 - 2);
  const u1 = randInt(rand, 0, 8);
  const u2 = randInt(rand, u1 + 1, 9);
  const a = t1 * 10 + u1;
  const b = t2 * 10 + u2;
  if (a - b < 10) return null;
  return {
    a,
    b,
    op: '-',
    missing: 'result',
    level: 3,
    skill: 'borrow',
    strategy: 'base-ten-sub',
  };
};

const missingTwoDigit: Maker = (rand) => {
  if (rand() < 0.5) {
    const whole = randInt(rand, 50, 95);
    const a = randInt(rand, 12, whole - 12);
    const b = whole - a;
    return {
      a,
      b,
      op: '+',
      missing: 'b',
      level: 3,
      skill: 'missing',
      strategy: 'bar-model',
    };
  }
  const a = randInt(rand, 52, 99);
  const b = randInt(rand, 12, a - 10);
  return {
    a,
    b,
    op: '-',
    missing: 'b',
    level: 3,
    skill: 'missing',
    strategy: 'bar-model',
  };
};

function pickMaker(level: Level, op: Op, rand: Rand): Maker | null {
  const roll = rand();
  if (level === 1) {
    if (op === '+') {
      if (roll < 0.4) return makeTen;
      if (roll < 0.6) return doubles;
      if (roll < 0.75) return nearDoubles;
      return plainAdd;
    }
    return roll < 0.6 ? crossTenSubtract : plainSubtract;
  }
  if (level === 2) {
    if (op === '+') return roll < 0.72 ? addNoCarry : missingWithinTwenty;
    return subtractNoBorrow;
  }
  if (op === '+') return roll < 0.75 ? addWithCarry : missingTwoDigit;
  return roll < 0.8 ? subtractWithBorrow : missingTwoDigit;
}

/**
 * Builds one question for a level/operation, retrying the template a few times
 * when a random draw does not satisfy its own constraints.
 */
export function makeQuestion(level: Level, op: Op, rand: Rand): Question | null {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const maker = pickMaker(level, op, rand);
    if (!maker) return null;
    const bp = maker(rand);
    if (!bp) continue;
    const q = build(bp);
    if (q.answer < 2 || q.result < 0 || q.result > 100) continue;
    if (bp.missing === 'result' && q.a < 2) continue;
    return q;
  }
  return null;
}

const opFor = (mode: Mode, index: number): Op => {
  if (mode === 'add') return '+';
  if (mode === 'sub') return '-';
  return index % 2 === 0 ? '+' : '-';
};

/** Deterministic per (seed, index), with uniqueness against earlier questions. */
export function nextQuestion(
  seed: number,
  index: number,
  level: Level,
  mode: Mode,
  used: ReadonlySet<string>,
  answerCounts: ReadonlyMap<number, number>,
): Question {
  const op = opFor(mode, index);
  let fallback: Question | null = null;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const rand = mulberry32(hashSeed(seed + attempt * 7919, index));
    let q = makeQuestion(level, op, rand);
    if (!q && mode === 'mixed') {
      q = makeQuestion(level, op === '+' ? '-' : '+', rand);
    }
    if (!q) continue;
    fallback = q;
    if (used.has(q.key)) continue;
    if ((answerCounts.get(q.answer) ?? 0) > 1) continue;
    return q;
  }
  if (fallback) return fallback;
  throw new Error(`Could not generate a level ${level} ${op} question`);
}
