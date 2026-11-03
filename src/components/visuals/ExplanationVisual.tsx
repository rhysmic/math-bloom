import type { Explanation } from '../../game/explain';
import { BarModel } from './BarModel';
import { Blocks, OperandCards } from './BaseTen';
import { NumberLine } from './NumberLine';
import { TenFrame } from './TenFrame';

export function ExplanationVisual({ explanation, step }: { explanation: Explanation; step: number }) {
  switch (explanation.kind) {
    case 'ten-frame': {
      const current = explanation.steps[Math.min(step, explanation.steps.length - 1)];
      return <TenFrame frameA={current.frameA} frameB={current.frameB} />;
    }
    case 'number-line': {
      const current = explanation.steps[Math.min(step, explanation.steps.length - 1)];
      return <NumberLine min={explanation.min} max={explanation.max} at={current.at} />;
    }
    case 'base-ten-add':
    case 'base-ten-sub': {
      const current = explanation.steps[Math.min(step, explanation.steps.length - 1)];
      if (step === 0 && explanation.operands) {
        return <OperandCards a={explanation.a} b={explanation.b} op={explanation.kind === 'base-ten-add' ? '+' : '-'} />;
      }
      return <Blocks rods={current.rods} ones={current.ones} bundle={current.ones >= 10} />;
    }
    case 'bar-model': {
      const current = explanation.steps[Math.min(step, explanation.steps.length - 1)];
      return (
        <BarModel
          whole={explanation.whole}
          part={explanation.part}
          missing={explanation.missing}
          revealed={current.revealed}
          op={explanation.op}
        />
      );
    }
  }
}
