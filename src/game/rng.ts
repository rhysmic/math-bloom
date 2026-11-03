export type Rand = () => number;

/** Small deterministic PRNG so a quiz can be regenerated after a refresh. */
export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(seed: number, index: number): number {
  let h = (2166136261 ^ seed) >>> 0;
  h = Math.imul(h, 16777619) ^ index;
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return h >>> 0;
}

export function randInt(rand: Rand, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

export function pick<T>(rand: Rand, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}
