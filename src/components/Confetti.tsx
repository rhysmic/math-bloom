import { useMemo } from 'react';

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        size: 8 + Math.random() * 9,
        color: ['var(--primary)', 'var(--mint)', 'var(--blush)'][i % 3],
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
