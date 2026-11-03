import { describe, expect, it } from 'vitest';
import { explain } from '../src/game/explain';
import type { Question } from '../src/game/types';

const q = (partial: Partial<Question>): Question => ({
  a: 37,
  b: 25,
  op: '+',
  result: 62,
  missing: 'result',
  answer: 62,
  level: 3,
  skill: 'carry',
  strategy: 'base-ten-add',
  key: '37+25',
  ...partial,
});

describe('explanations', () => {
  it('shows base-ten carrying in four short steps', () => {
    const steps = explain(q({}));
    expect(steps.kind).toBe('base-ten-add');
    if (steps.kind !== 'base-ten-add') return;
    expect(steps.steps).toHaveLength(4);
    expect(steps.steps[3].rods).toBe(6);
    expect(steps.steps[3].ones).toBe(2);
    expect(steps.steps[3].caption).toBe('62');
  });

  it('shows base-ten borrowing for 62 - 38', () => {
    const steps = explain(
      q({ a: 62, b: 38, op: '-', result: 24, answer: 24, strategy: 'base-ten-sub', skill: 'borrow', key: '62-38' }),
    );
    expect(steps.kind).toBe('base-ten-sub');
    if (steps.kind !== 'base-ten-sub') return;
    expect(steps.steps).toHaveLength(3);
    expect(steps.steps[2].caption).toBe('62 − 38 = 24');
    expect(steps.steps[1].ones).toBe(12);
  });

  it('fills a ten frame for 8 + 5', () => {
    const steps = explain(q({ a: 8, b: 5, op: '+', result: 13, answer: 13, strategy: 'ten-frame', level: 1 }));
    expect(steps.kind).toBe('ten-frame');
    if (steps.kind !== 'ten-frame') return;
    expect(steps.steps[1]).toEqual({ caption: '10 + 3', frameA: 10, frameB: 3 });
    expect(steps.steps.at(-1)?.caption).toBe('13');
  });

  it('shows the missing part on a bar model', () => {
    const steps = explain(
      q({ a: 7, b: 6, op: '+', result: 13, missing: 'b', answer: 6, strategy: 'bar-model', skill: 'missing', level: 2 }),
    );
    expect(steps.kind).toBe('bar-model');
    if (steps.kind !== 'bar-model') return;
    expect(steps.whole).toBe(13);
    expect(steps.missing).toBe(6);
    expect(steps.steps.at(-1)?.caption).toBe('6');
  });
});
