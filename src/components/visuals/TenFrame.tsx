interface TenFrameProps {
  frameA: number;
  frameB: number;
}

function Frame({ count, tone }: { count: number; tone: 'a' | 'b' }) {
  return (
    <div className={`ten-frame ten-frame--${tone}`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={`ten-cell ${i < count ? 'is-filled' : ''}`} />
      ))}
    </div>
  );
}

export function TenFrame({ frameA, frameB }: TenFrameProps) {
  return (
    <div className="ten-frames">
      <Frame count={Math.min(10, frameA)} tone="a" />
      <Frame count={Math.min(10, frameB)} tone="b" />
    </div>
  );
}
