import { useEffect, useState } from 'react';
import { formatTime } from '../game/session';
import type { Session, Summary } from '../game/types';
import { levelName, t, type Lang } from '../i18n';
import { playWin } from '../sound/audio';
import { Confetti } from './Confetti';
import { ExplanationSheet } from './ExplanationSheet';
import { Flower } from './Flower';
import { ArrowRightIcon, HomeIcon, ReplayIcon, SearchIcon } from './Icons';
import { Mascot } from './Mascot';
import { Stars } from './Stars';

interface ResultProps {
  session: Session;
  summary: Summary;
  lang: Lang;
  onAgain: () => void;
  onHome: () => void;
  onNext: () => void;
}

export function Result({ session, summary, lang, onAgain, onHome, onNext }: ResultProps) {
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const items = session.questions.slice(0, summary.total).map((question, i) => ({
    question,
    record: session.records[i],
  }));
  const missedIndex = items.findIndex((item) => item.record && !item.record.firstTry);
  const message = summary.firstTryCorrect === summary.total ? 'perfect' : summary.stars === 3 ? 'great' : 'good';
  const canLevelUp = summary.stars === 3 && summary.level < 3;

  useEffect(() => {
    playWin();
  }, []);

  return (
    <div className="screen result">
      {summary.stars === 3 && <Confetti />}

      <div className="result__card">
        <Mascot size={104} mood={summary.stars === 3 ? 'party' : 'happy'} className="result__mascot" />
        <Stars count={summary.stars} />
        <p className="result__message">{t(lang, message)}</p>

        <div className="result__score">
          <strong>{summary.firstTryCorrect}</strong>
          <span>/{summary.total}</span>
        </div>

        <div className="result__stats">
          <span className="stat">
            <span className="stat__value">{formatTime(summary.ms)}</span>
            <span className="stat__label">{t(lang, 'time')}</span>
          </span>
          <span className="stat">
            <span className="stat__value">×{summary.bestStreak}</span>
            <span className="stat__label">{t(lang, 'streak')}</span>
          </span>
          <span className="stat">
            <span className="stat__value">{levelName(lang, summary.level)}</span>
            <span className="stat__label">{t(lang, 'level')}</span>
          </span>
        </div>

        <div className="garden" role="list" aria-label={t(lang, 'review')}>
          {items.map((item, i) => (
            <button
              key={item.question.key}
              type="button"
              role="listitem"
              className={`garden__item ${item.record?.firstTry ? 'is-grown' : ''}`}
              onClick={() => setReviewIndex(i)}
              aria-label={`${i + 1}`}
            >
              <Flower grown={Boolean(item.record?.firstTry)} size={40} />
            </button>
          ))}
        </div>

        <div className="result__actions">
          {missedIndex >= 0 && (
            <button type="button" className="btn btn--soft" onClick={() => setReviewIndex(missedIndex)}>
              <SearchIcon size={22} />
              {t(lang, 'review')}
            </button>
          )}
          <button type="button" className="btn btn--primary" onClick={onAgain}>
            <ReplayIcon size={22} />
            {t(lang, 'again')}
          </button>
        </div>

        <div className="result__secondary">
          <button type="button" className="text-btn" onClick={onHome}>
            <HomeIcon size={20} />
            {t(lang, 'home')}
          </button>
          {canLevelUp && (
            <button type="button" className="text-btn text-btn--accent" onClick={onNext}>
              {t(lang, 'newLevel')}
              <ArrowRightIcon size={20} />
            </button>
          )}
        </div>
      </div>

      {reviewIndex !== null && items[reviewIndex] && (
        <ExplanationSheet
          question={items[reviewIndex].question}
          lang={lang}
          mode="full"
          onClose={() => setReviewIndex(null)}
        />
      )}
    </div>
  );
}
