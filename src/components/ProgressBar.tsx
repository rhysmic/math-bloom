interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="progress">
      <div className="progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
        <div className="progress__fill" style={{ width: `${pct}%` }}>
          <span className="progress__tip" aria-hidden />
        </div>
      </div>
      <span className="progress__count">
        {current}/{total}
      </span>
    </div>
  );
}
