import type { Question } from '../game/types';

interface EquationProps {
  question: Question;
  value: string;
  status: 'idle' | 'wrong' | 'correct';
}

export function Equation({ question, value, status }: EquationProps) {
  const op = question.op === '+' ? '+' : '−';
  const slot = (
    <span className={`answer-slot ${value ? 'has-value' : ''} ${status !== 'idle' ? `is-${status}` : ''}`}>
      {value || <span className="answer-slot__ghost">?</span>}
    </span>
  );

  return (
    <div className={`equation ${status !== 'idle' ? `is-${status}` : ''}`} aria-live="polite">
      <span className="equation__num">{question.a}</span>
      <span className="equation__sym">{op}</span>
      {question.missing === 'b' ? (
        <>
          {slot}
          <span className="equation__sym">=</span>
          <span className="equation__num">{question.result}</span>
        </>
      ) : (
        <>
          <span className="equation__num">{question.b}</span>
          <span className="equation__sym">=</span>
          {slot}
        </>
      )}
    </div>
  );
}
