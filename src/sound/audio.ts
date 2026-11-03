let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean): void {
  muted = value;
}

export function unlockAudio(): void {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
}

function tone(freq: number, start: number, duration: number, peak = 0.12, type: OscillatorType = 'triangle'): void {
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playTap(): void {
  tone(660, 0, 0.07, 0.05, 'sine');
}

export function playCorrect(): void {
  tone(523.25, 0, 0.16, 0.1);
  tone(659.25, 0.08, 0.16, 0.1);
  tone(783.99, 0.16, 0.28, 0.11);
}

export function playWrong(): void {
  tone(233.08, 0, 0.18, 0.09, 'sine');
  tone(196.0, 0.12, 0.24, 0.08, 'sine');
}

export function playWin(): void {
  [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) => {
    tone(f, i * 0.11, 0.32, 0.1);
  });
}

export function playBloom(): void {
  tone(880, 0, 0.12, 0.06, 'sine');
  tone(1174.66, 0.06, 0.18, 0.05, 'sine');
}
