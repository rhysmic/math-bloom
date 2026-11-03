interface BarModelProps {
  whole: number;
  part: number;
  missing: number;
  revealed: boolean;
  op: '+' | '-';
}

export function BarModel({ whole, part, missing, revealed, op }: BarModelProps) {
  const partPct = Math.max(12, Math.min(88, (part / whole) * 100));
  const missingPct = 100 - partPct;

  return (
    <div className="bar-model">
      <div className="bar-model__row">
        <div className="bar-model__whole">
          <span>{whole}</span>
        </div>
      </div>
      <div className="bar-model__row bar-model__parts">
        <div className="bar-model__part" style={{ flexBasis: `${partPct}%` }}>
          <span>{part}</span>
        </div>
        <div className={`bar-model__missing ${revealed ? 'is-revealed' : ''}`} style={{ flexBasis: `${missingPct}%` }}>
          <span>{revealed ? missing : '?'}</span>
        </div>
      </div>
      <div className="bar-model__formula">
        {op === '+' ? `${part} + ${revealed ? missing : '?'} = ${whole}` : `${whole} − ${revealed ? missing : '?'} = ${part}`}
      </div>
    </div>
  );
}
