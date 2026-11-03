export function Flower({ grown = true, size = 46 }: { grown?: boolean; size?: number }) {
  if (!grown) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <path d="M24 44V27" stroke="#33272A" strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d="M24 33c-5-1-8-4-9-8 5 0 8 3 9 8z" fill="var(--mint)" stroke="#33272A" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M24 25c0-5 2-9 6-12 2 6 0 10-6 12z" fill="var(--blush)" stroke="#33272A" strokeWidth={2.4} strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path d="M24 44V30" stroke="#33272A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M24 37c-5-1-8-4-9-8 5 0 8 3 9 8z" fill="var(--mint)" stroke="#33272A" strokeWidth={2.4} strokeLinejoin="round" />
      <g stroke="#33272A" strokeWidth={2.4}>
        <circle cx="24" cy="12" r="7" fill="var(--primary)" />
        <circle cx="34" cy="20" r="7" fill="var(--primary)" />
        <circle cx="30" cy="31" r="7" fill="var(--primary)" />
        <circle cx="18" cy="31" r="7" fill="var(--primary)" />
        <circle cx="14" cy="20" r="7" fill="var(--primary)" />
      </g>
      <circle cx="24" cy="22" r="5.5" fill="var(--mint)" stroke="#33272A" strokeWidth={2.4} />
    </svg>
  );
}

export function LevelGlyph({ stage, size = 38 }: { stage: 1 | 2 | 3; size?: number }) {
  if (stage === 3) return <Flower size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path d="M24 43V27" stroke="#33272A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M24 36c-5-1-8-4-9-8 5 0 8 3 9 8z" fill="var(--mint)" stroke="#33272A" strokeWidth={2.4} strokeLinejoin="round" />
      {stage === 2 && (
        <path d="M24 30c5-1 8-4 9-8-5 0-8 3-9 8z" fill="var(--mint)" stroke="#33272A" strokeWidth={2.4} strokeLinejoin="round" />
      )}
      <circle cx="24" cy="24" r="4" fill="var(--primary)" stroke="#33272A" strokeWidth={2.4} />
    </svg>
  );
}
