import type { Level, Mode, Session } from './types';

export type Lang = 'en' | 'zh';

export interface Settings {
  mode: Mode;
  level: Level;
  count: number;
  sound: boolean;
  lang: Lang;
}

export interface Snapshot {
  session: Session;
  savedAt: number;
}

export interface Store {
  settings: Settings;
  bests: Record<string, number>;
  totalStars: number;
}

const KEY = 'mathbloom.v1';
const SNAPSHOT_MAX_AGE = 12 * 60 * 60 * 1000;

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export const defaultSettings = (): Settings => ({
  mode: 'mixed',
  level: 1,
  count: 15,
  sound: true,
  lang: detectLang(),
});

export const bestKey = (mode: Mode, level: Level, count: number) => `${mode}-${level}-${count}`;

export function loadStore(): Store {
  const fallback: Store = { settings: defaultSettings(), bests: {}, totalStars: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      settings: { ...fallback.settings, ...(parsed.settings ?? {}) },
      bests: parsed.bests ?? {},
      totalStars: parsed.totalStars ?? 0,
    };
  } catch {
    return fallback;
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable — the app still works in-memory */
  }
}

export function loadSnapshot(): Snapshot | null {
  try {
    const raw = localStorage.getItem(`${KEY}.snapshot`);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as Snapshot;
    if (!snapshot.session || typeof snapshot.savedAt !== 'number') return null;
    if (Date.now() - snapshot.savedAt > SNAPSHOT_MAX_AGE) {
      localStorage.removeItem(`${KEY}.snapshot`);
      return null;
    }
    if (snapshot.session.index >= snapshot.session.count) return null;
    return snapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(session: Session): void {
  try {
    localStorage.setItem(`${KEY}.snapshot`, JSON.stringify({ session, savedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function clearSnapshot(): void {
  try {
    localStorage.removeItem(`${KEY}.snapshot`);
  } catch {
    /* ignore */
  }
}
