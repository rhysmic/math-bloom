interface NumberLineProps {
  min: number;
  max: number;
  at: number;
}

const W = 340;
const H = 128;
const PAD = 26;

export function NumberLine({ min, max, at }: NumberLineProps) {
  const span = Math.max(1, max - min);
  const x = (v: number) => PAD + ((v - min) / span) * (W - PAD * 2);
  const step = span <= 10 ? 2 : 5;
  const ticks: number[] = [];
  for (let v = min; v <= max; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] !== max) ticks.push(max);

  return (
    <svg className="number-line" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`number line from ${min} to ${max}`}>
      <line x1={PAD} y1={78} x2={W - PAD} y2={78} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={70} x2={x(v)} y2={86} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
          <text x={x(v)} y={108} textAnchor="middle" className="number-line__label">
            {v}
          </text>
        </g>
      ))}
      <g
        style={{
          transform: `translateX(${x(at)}px)`,
          transition: 'transform 450ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <circle cx={0} cy={78} r={13} fill="var(--primary)" stroke="var(--ink)" strokeWidth={4} />
        <circle cx={0} cy={78} r={4} fill="var(--ink)" />
      </g>
    </svg>
  );
}
