import type { Level, Mode } from '../game/types';
import { levelName, t, type Lang } from '../i18n';
import { LevelGlyph } from './Flower';
import { PlayIcon, SoundOffIcon, SoundOnIcon, TrophyIcon } from './Icons';
import { Mascot } from './Mascot';

interface HomeProps {
  lang: Lang;
  mode: Mode;
  level: Level;
  count: number;
  best: number | null;
  sound: boolean;
  canResume: boolean;
  onMode: (mode: Mode) => void;
  onLevel: (level: Level) => void;
  onCount: (count: number) => void;
  onPlay: () => void;
  onResume: () => void;
  onToggleSound: () => void;
  onToggleLang: () => void;
}

const MODES: { id: Mode; symbol: string }[] = [
  { id: 'add', symbol: '+' },
  { id: 'sub', symbol: '−' },
  { id: 'mixed', symbol: '±' },
];

const LEVELS: Level[] = [1, 2, 3];
const COUNTS = [10, 15, 20];

export function Home({
  lang,
  mode,
  level,
  count,
  best,
  sound,
  canResume,
  onMode,
  onLevel,
  onCount,
  onPlay,
  onResume,
  onToggleSound,
  onToggleLang,
}: HomeProps) {
  return (
    <div className="screen home">
      <header className="home__head">
        <div className="brand">
          <Mascot size={46} />
          <span className="brand__name">Math Bloom</span>
        </div>
        <div className="home__tools">
          <button type="button" className="icon-btn icon-btn--text" onClick={onToggleLang} aria-label="Language">
            {lang === 'en' ? '中' : 'EN'}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleSound}
            aria-label={t(lang, sound ? 'soundOn' : 'soundOff')}
          >
            {sound ? <SoundOnIcon size={26} /> : <SoundOffIcon size={26} />}
          </button>
        </div>
      </header>

      <main className="home__body">
        <div className="home__hero">
          <Mascot size={200} mood="happy" className="home__mascot" />
        </div>

        <div className="home__panel">
          <div className="mode-row" role="group" aria-label={t(lang, 'add')}>
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`mode-btn ${mode === m.id ? 'is-active' : ''}`}
                onClick={() => onMode(m.id)}
                aria-pressed={mode === m.id}
              >
                <span className="mode-btn__symbol">{m.symbol}</span>
                <span className="mode-btn__label">{t(lang, m.id)}</span>
              </button>
            ))}
          </div>

          <div className="level-row" role="group" aria-label={t(lang, 'level')}>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                className={`level-btn ${level === l ? 'is-active' : ''}`}
                onClick={() => onLevel(l)}
                aria-pressed={level === l}
              >
                <LevelGlyph stage={l} />
                <span className="level-btn__label">{levelName(lang, l)}</span>
              </button>
            ))}
          </div>

          <div className="count-row" role="group" aria-label={t(lang, 'questions')}>
            {COUNTS.map((c) => (
              <button
                key={c}
                type="button"
                className={`count-chip ${count === c ? 'is-active' : ''}`}
                onClick={() => onCount(c)}
                aria-pressed={count === c}
              >
                {c}
              </button>
            ))}
          </div>

          <button type="button" className="btn btn--primary home__play" onClick={onPlay}>
            <PlayIcon size={30} />
            {t(lang, 'play')}
          </button>

          {canResume && (
            <button type="button" className="btn btn--ghost home__resume" onClick={onResume}>
              {t(lang, 'continue')}
            </button>
          )}

          {best !== null && (
            <div className="home__best">
              <TrophyIcon size={22} />
              <span>
                {t(lang, 'best')} {best}/{count}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
