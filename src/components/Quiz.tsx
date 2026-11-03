import { useCallback, useEffect, useRef, useState } from 'react';
import { currentQuestion } from '../game/session';
import type { AnswerRecord, Session } from '../game/types';
import { t, type Lang } from '../i18n';
import { playCorrect, playTap, playWrong } from '../sound/audio';
import { Equation } from './Equation';
import { ExplanationSheet } from './ExplanationSheet';
import { BulbIcon, CloseIcon, SoundOffIcon, SoundOnIcon } from './Icons';
import { Keypad } from './Keypad';
import { Mascot, type Mood } from './Mascot';
import { ProgressBar } from './ProgressBar';

interface QuizProps {
  session: Session;
  lang: Lang;
  sound: boolean;
  onToggleSound: () => void;
  onExit: () => void;
  onRecord: (record: AnswerRecord) => void;
}

export function Quiz({ session, lang, sound, onToggleSound, onExit, onRecord }: QuizProps) {
  const question = currentQuestion(session);

  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [sheet, setSheet] = useState<'hint' | 'full' | null>(null);

  const startedAt = useRef(Date.now());
  const timers = useRef<number[]>([]);
  const pending = useRef<AnswerRecord | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => {
    setValue('');
    setStatus('idle');
    setAttempts(0);
    setUsedHint(false);
    setSheet(null);
    pending.current = null;
    startedAt.current = Date.now();
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    // reset the play area whenever a new question arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.key]);

  const addDigit = useCallback(
    (digit: string) => {
      if (!question || sheet || status === 'correct') return;
      playTap();
      setValue((prev) => {
        if (prev.length >= 3) return prev;
        if (prev === '0') return digit;
        return prev + digit;
      });
    },
    [question, sheet, status],
  );

  const backspace = useCallback(() => {
    if (sheet || status === 'correct') return;
    playTap();
    setValue((prev) => prev.slice(0, -1));
  }, [sheet, status]);

  const submit = useCallback(() => {
    if (!question || !value || sheet || status === 'correct') return;
    const guess = Number(value);

    if (guess === question.answer) {
      const record: AnswerRecord = {
        firstTry: attempts === 0,
        attempts: attempts + 1,
        usedHint,
        ms: Date.now() - startedAt.current,
      };
      setStatus('correct');
      playCorrect();
      later(() => onRecord(record), 950);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus('wrong');
    playWrong();
    setValue('');

    if (nextAttempts >= 2) {
      pending.current = {
        firstTry: false,
        attempts: nextAttempts,
        usedHint,
        ms: Date.now() - startedAt.current,
      };
      later(() => setSheet('full'), 800);
    } else {
      later(() => setStatus('idle'), 900);
    }
  }, [question, value, sheet, status, attempts, usedHint, later, onRecord]);

  const closeSheet = useCallback(() => {
    setSheet(null);
    const record = pending.current;
    pending.current = null;
    if (record) onRecord(record);
  }, [onRecord]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (sheet) {
        if (event.key === 'Escape') closeSheet();
        return;
      }
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        addDigit(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        backspace();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        submit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sheet, addDigit, backspace, submit, closeSheet]);

  const openHint = () => {
    setUsedHint(true);
    setSheet('hint');
  };

  if (!question) return null;

  const mood: Mood = status === 'correct' ? 'happy' : status === 'wrong' ? 'sad' : 'idle';
  const feedback = status === 'correct' ? t(lang, 'nice') : status === 'wrong' ? (attempts >= 2 ? t(lang, 'almost') : t(lang, 'tryAgain')) : '';

  return (
    <div className="screen quiz">
      <header className="quiz__top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label={t(lang, 'close')}>
          <CloseIcon size={26} />
        </button>
        <ProgressBar current={session.index + 1} total={session.count} />
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSound}
          aria-label={t(lang, sound ? 'soundOn' : 'soundOff')}
        >
          {sound ? <SoundOnIcon size={26} /> : <SoundOffIcon size={26} />}
        </button>
      </header>

      <main className="quiz__body">
        <aside className="quiz__side">
          <Mascot mood={mood} size={180} className="quiz__mascot" />
        </aside>

        <section className={`quiz__play is-${status}`}>
          <div className="equation-wrap">
            <Equation question={question} value={value} status={status} />
          </div>
          <div className="quiz__tools">
            <button type="button" className="btn btn--ghost hint-btn" onClick={openHint}>
              <BulbIcon size={24} />
              {t(lang, 'hint')}
            </button>
            <div className={`feedback ${status !== 'idle' ? 'is-on' : ''}`} aria-live="assertive">
              {feedback}
            </div>
          </div>
          <Keypad
            lang={lang}
            onDigit={addDigit}
            onBackspace={backspace}
            onSubmit={submit}
            disabled={Boolean(sheet) || status === 'correct'}
          />
        </section>
      </main>

      {sheet && (
        <ExplanationSheet
          question={question}
          lang={lang}
          mode={sheet}
          onClose={closeSheet}
          onDone={closeSheet}
        />
      )}
    </div>
  );
}
