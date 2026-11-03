import type { Question } from './types';

export interface TenFrameStep {
  caption: string;
  frameA: number;
  frameB: number;
}

export interface NumberLineStep {
  caption: string;
  at: number;
}

export interface BlocksStep {
  caption: string;
  rods: number;
  ones: number;
}

export interface BarStep {
  caption: string;
  revealed: boolean;
}

export interface TenFrameExplanation {
  kind: 'ten-frame';
  steps: TenFrameStep[];
}

export interface NumberLineExplanation {
  kind: 'number-line';
  min: number;
  max: number;
  steps: NumberLineStep[];
}

export interface BlocksExplanation {
  kind: 'base-ten-add' | 'base-ten-sub';
  operands: boolean;
  a: number;
  b: number;
  steps: BlocksStep[];
}

export interface BarExplanation {
  kind: 'bar-model';
  whole: number;
  part: number;
  missing: number;
  op: '+' | '-';
  steps: BarStep[];
}

export type Explanation =
  | TenFrameExplanation
  | NumberLineExplanation
  | BlocksExplanation
  | BarExplanation;

const ones = (n: number) => n % 10;

function tenFrame(q: Question): TenFrameExplanation {
  const sum = q.a + q.b;
  const steps: TenFrameStep[] = [
    { caption: `${q.a} + ${q.b}`, frameA: q.a, frameB: q.b },
  ];
  if (sum > 10) {
    steps.push({ caption: `10 + ${sum - 10}`, frameA: 10, frameB: sum - 10 });
  }
  steps.push({ caption: `${sum}`, frameA: Math.min(sum, 10), frameB: Math.max(0, sum - 10) });
  return { kind: 'ten-frame', steps };
}

function numberLine(q: Question): NumberLineExplanation {
  const result = q.a - q.b;
  const steps: NumberLineStep[] = [{ caption: `${q.a}`, at: q.a }];
  if (q.a > 10 && result < 10) {
    steps.push({ caption: `− ${q.a - 10}`, at: 10 });
  }
  steps.push({ caption: `− ${q.b}`, at: result });
  return {
    kind: 'number-line',
    min: Math.max(0, Math.min(result, 10) - 2),
    max: q.a + 1,
    steps,
  };
}

function baseTenAdd(q: Question): BlocksExplanation {
  const aT = Math.floor(q.a / 10);
  const bT = Math.floor(q.b / 10);
  const aO = ones(q.a);
  const bO = ones(q.b);
  const rods = aT + bT;
  const looseOnes = aO + bO;
  const result = q.a + q.b;
  const steps: BlocksStep[] = [
    { caption: `${q.a} + ${q.b}`, rods: 0, ones: 0 },
    { caption: `${aT * 10} + ${bT * 10} = ${rods * 10}`, rods, ones: 0 },
    { caption: `${aO} + ${bO} = ${looseOnes}`, rods, ones: looseOnes },
  ];
  if (looseOnes > 9) {
    steps.push({ caption: `${String(result)}`, rods: rods + 1, ones: looseOnes - 10 });
  } else {
    steps.push({ caption: `${result}`, rods, ones: looseOnes });
  }
  return { kind: 'base-ten-add', operands: true, a: q.a, b: q.b, steps };
}

function baseTenSub(q: Question): BlocksExplanation {
  const aT = Math.floor(q.a / 10);
  const bT = Math.floor(q.b / 10);
  const aO = ones(q.a);
  const bO = ones(q.b);
  const borrow = aO < bO;
  const result = q.a - q.b;
  const resultRods = Math.floor(result / 10);
  const resultOnes = result % 10;
  const steps: BlocksStep[] = [{ caption: `${q.a} − ${q.b}`, rods: 0, ones: 0 }];

  if (borrow) {
    steps.push({
      caption: `${(aT - 1) * 10} + ${aO + 10}`,
      rods: aT - 1,
      ones: aO + 10,
    });
    steps.push({
      caption: `${q.a} − ${q.b} = ${result}`,
      rods: resultRods,
      ones: resultOnes,
    });
  } else {
    steps.push({ caption: `${aT * 10} − ${bT * 10} = ${(aT - bT) * 10}`, rods: aT - bT, ones: aO });
    steps.push({ caption: `${aO} − ${bO} = ${aO - bO}`, rods: aT - bT, ones: aO - bO });
    steps.push({ caption: `${result}`, rods: resultRods, ones: resultOnes });
  }

  return { kind: 'base-ten-sub', operands: true, a: q.a, b: q.b, steps };
}

function barModel(q: Question): BarExplanation {
  if (q.op === '+') {
    const whole = q.a + q.b;
    return {
      kind: 'bar-model',
      whole,
      part: q.a,
      missing: q.b,
      op: '+',
      steps: [
        { caption: `${q.a} + ? = ${whole}`, revealed: false },
        { caption: `${whole} − ${q.a} = ${q.b}`, revealed: true },
        { caption: `${q.b}`, revealed: true },
      ],
    };
  }
  return {
    kind: 'bar-model',
    whole: q.a,
    part: q.a - q.b,
    missing: q.b,
    op: '-',
    steps: [
      { caption: `${q.a} − ? = ${q.a - q.b}`, revealed: false },
      { caption: `${q.a} − ${q.a - q.b} = ${q.b}`, revealed: true },
      { caption: `${q.b}`, revealed: true },
    ],
  };
}

export function explain(q: Question): Explanation {
  switch (q.strategy) {
    case 'ten-frame':
      return tenFrame(q);
    case 'number-line':
      return numberLine(q);
    case 'base-ten-add':
      return baseTenAdd(q);
    case 'base-ten-sub':
      return baseTenSub(q);
    case 'bar-model':
      return barModel(q);
  }
}
