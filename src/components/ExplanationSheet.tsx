import { useMemo, useState } from 'react';
import { explain } from '../game/explain';
import type { Question } from '../game/types';
import { t, type Lang } from '../i18n';
import { ArrowRightIcon, CheckIcon, CloseIcon } from './Icons';
import { ExplanationVisual } from './visuals/ExplanationVisual';

interface ExplanationSheetProps {
  question: Question;
  lang: Lang;
  mode?: 'hint' | 'full';
  onClose: () => void;
  onDone?: () => void;
}

function equationText(question: Question): string {
  const op = question.op === '+' ? '+' : '−';
  if (question.missing === 'b') return `${question.a} ${op} ? = ${question.result}`;
  return `${question.a} ${op} ${question.b} = ?`;
}

export function ExplanationSheet({ question, lang, mode = 'full', onClose, onDone }: ExplanationSheetProps) {
  const explanation = useMemo(() => explain(question), [question]);
  const [step, setStep] = useState(0);
  const [full, setFull] = useState(mode === 'full');
  const last = explanation.steps.length - 1;
  const caption = explanation.steps[Math.min(step, last)].caption;
  const atEnd = step >= last;

  const finish = () => {
    if (onDone) onDone();
    else onClose();
  };

  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label={equationText(question)}>
      <div className="sheet">
        <header className="sheet__top">
          <span className="sheet__equation">{equationText(question)}</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t(lang, 'close')}>
            <CloseIcon size={26} />
          </button>
        </header>

        <div className="sheet__visual">
          <ExplanationVisual explanation={explanation} step={step} />
        </div>

        <div className="sheet__caption" aria-live="polite">
          {caption}
        </div>

        {full ? (
          <>
            <div className="sheet__dots" aria-hidden>
              {Array.from({ length: explanation.steps.length }).map((_, i) => (
                <span key={i} className={`step-dot ${i === step ? 'is-on' : ''} ${i < step ? 'is-past' : ''}`} />
              ))}
            </div>
            <div className="sheet__actions">
              {!atEnd ? (
                <>
                  <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                    {t(lang, 'back')}
                  </button>
                  <button type="button" className="btn btn--primary" onClick={() => setStep((s) => Math.min(last, s + 1))}>
                    {t(lang, 'next')}
                    <ArrowRightIcon size={22} />
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn--primary btn--wide" onClick={finish}>
                  <CheckIcon size={22} />
                  {t(lang, 'gotIt')}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="sheet__actions">
            <button type="button" className="btn btn--primary btn--wide" onClick={() => setFull(true)}>
              {t(lang, 'showMe')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
