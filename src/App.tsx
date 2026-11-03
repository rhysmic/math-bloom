import { useEffect, useState } from 'react';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { buildSummary } from './game/score';
import { createSession, isFinished, recordAnswer } from './game/session';
import {
  bestKey,
  clearSnapshot,
  loadSnapshot,
  loadStore,
  saveSnapshot,
  saveStore,
  type Settings,
  type Store,
} from './game/storage';
import type { AnswerRecord, Level, QuizConfig, Session, Summary } from './game/types';
import { setMuted, unlockAudio } from './sound/audio';

type Screen = 'home' | 'quiz' | 'result';

export default function App() {
  const [boot] = useState(() => loadSnapshot());
  const [store, setStore] = useState<Store>(() => loadStore());
  const [session, setSession] = useState<Session | null>(boot?.session ?? null);
  const [finished, setFinished] = useState<Session | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [screen, setScreen] = useState<Screen>(boot ? 'quiz' : 'home');

  const settings = store.settings;

  useEffect(() => {
    setMuted(!settings.sound);
  }, [settings.sound]);

  useEffect(() => {
    document.documentElement.lang = settings.lang === 'zh' ? 'zh-CN' : 'en';
  }, [settings.lang]);

  const updateSettings = (patch: Partial<Settings>) => {
    setStore((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...patch } };
      saveStore(next);
      return next;
    });
  };

  const start = (config: QuizConfig) => {
    unlockAudio();
    const next = createSession(config);
    setSession(next);
    saveSnapshot(next);
    setFinished(null);
    setSummary(null);
    setScreen('quiz');
  };

  const handleRecord = (record: AnswerRecord) => {
    if (!session) return;
    const next = recordAnswer(session, record);

    if (!isFinished(next)) {
      setSession(next);
      saveSnapshot(next);
      return;
    }

    const result = buildSummary(next.records, next.count, next.baseLevel, {
      mode: next.mode,
      level: next.baseLevel,
      count: next.count,
    });

    setStore((prev) => {
      const key = bestKey(next.mode, next.baseLevel, next.count);
      const bests = { ...prev.bests, [key]: Math.max(prev.bests[key] ?? 0, result.firstTryCorrect) };
      const updated = { ...prev, bests, totalStars: prev.totalStars + result.stars };
      saveStore(updated);
      return updated;
    });

    clearSnapshot();
    setSession(null);
    setFinished(next);
    setSummary(result);
    setScreen('result');
  };

  const toggleSound = () => {
    unlockAudio();
    updateSettings({ sound: !settings.sound });
  };

  const toggleLang = () => {
    updateSettings({ lang: settings.lang === 'en' ? 'zh' : 'en' });
  };

  const best = store.bests[bestKey(settings.mode, settings.level, settings.count)] ?? null;

  return (
    <div className="app" onPointerDown={unlockAudio}>
      {screen === 'quiz' && session && (
        <Quiz
          session={session}
          lang={settings.lang}
          sound={settings.sound}
          onToggleSound={toggleSound}
          onExit={() => setScreen('home')}
          onRecord={handleRecord}
        />
      )}

      {screen === 'result' && finished && summary && (
        <Result
          session={finished}
          summary={summary}
          lang={settings.lang}
          onAgain={() => start(summary.config)}
          onHome={() => {
            setScreen('home');
            setFinished(null);
            setSummary(null);
          }}
          onNext={() => start({ ...summary.config, level: Math.min(3, summary.level + 1) as Level })}
        />
      )}

      {screen === 'home' && (
        <Home
          lang={settings.lang}
          mode={settings.mode}
          level={settings.level}
          count={settings.count}
          best={best}
          sound={settings.sound}
          canResume={Boolean(session)}
          onMode={(mode) => updateSettings({ mode })}
          onLevel={(level) => updateSettings({ level })}
          onCount={(count) => updateSettings({ count })}
          onPlay={() => start({ mode: settings.mode, level: settings.level, count: settings.count })}
          onResume={() => setScreen('quiz')}
          onToggleSound={toggleSound}
          onToggleLang={toggleLang}
        />
      )}
    </div>
  );
}
