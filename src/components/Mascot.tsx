export type Mood = 'idle' | 'happy' | 'sad' | 'party';

interface MascotProps {
  mood?: Mood;
  size?: number;
  className?: string;
}

export function Mascot({ mood = 'idle', size = 160, className }: MascotProps) {
  const eyes = mood === 'party';
  const mouth =
    mood === 'happy' || mood === 'party'
      ? 'M60 92 Q70 104 80 92 Q70 98 60 92'
      : mood === 'sad'
        ? 'M61 98 Q70 92 79 98'
        : 'M62 93 Q70 100 78 93';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 140 140"
      role="img"
      aria-label="Sprig the sprout"
    >
      <g stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 44 C70 34 70 26 70 18" fill="none" />
        <path d="M70 26 C82 22 92 14 94 6 C82 6 72 12 70 24 Z" fill="var(--mint)" strokeWidth={4} />
        <path d="M66 30 C56 28 47 22 44 15 C55 15 65 21 68 30 Z" fill="var(--mint)" strokeWidth={4} />
        <circle cx="70" cy="82" r="42" fill="#FFFBF7" />
        <path d="M30 86 q-8 5 -7 13" fill="none" strokeWidth={4.5} />
        <path d="M110 86 q8 5 7 13" fill="none" strokeWidth={4.5} />
      </g>

      <circle cx="46" cy="93" r="9" fill="var(--blush)" opacity={0.85} />
      <circle cx="94" cy="93" r="9" fill="var(--blush)" opacity={0.85} />

      {eyes ? (
        <g stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M51 76 q6 -8 12 0" />
          <path d="M77 76 q6 -8 12 0" />
        </g>
      ) : (
        <g fill="var(--ink)">
          <circle cx="57" cy="76" r="5.4" />
          <circle cx="83" cy="76" r="5.4" />
        </g>
      )}

      <path d={mouth} fill={mood === 'happy' || mood === 'party' ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth={4.2} strokeLinecap="round" />

      {mood === 'party' && (
        <g fill="var(--primary)" stroke="var(--ink)" strokeWidth={2}>
          <path d="M18 40 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" />
          <path d="M118 30 l2.4 5.6 5.6.8 -4 4 1 5.6 -5 -2.8 -5 2.8 1 -5.6 -4 -4 5.6 -.8z" />
        </g>
      )}
    </svg>
  );
}
