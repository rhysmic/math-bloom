interface BlocksProps {
  rods: number;
  ones: number;
  bundle?: boolean;
}

function Rod() {
  return <span className="rod" aria-hidden />;
}

function Dot({ className = '' }: { className?: string }) {
  return <span className={`unit-dot ${className}`} aria-hidden />;
}

export function Blocks({ rods, ones, bundle = false }: BlocksProps) {
  const packet = bundle && ones >= 10 ? 10 : 0;
  const rest = ones - packet;
  return (
    <div className="blocks">
      <div className="blocks__rods">{Array.from({ length: rods }).map((_, i) => <Rod key={i} />)}</div>
      <div className="blocks__ones">
        {packet > 0 && (
          <div className="dot-packet">
            {Array.from({ length: packet }).map((_, i) => <Dot key={i} />)}
          </div>
        )}
        {rest > 0 && (
          <div className="loose-dots">
            {Array.from({ length: rest }).map((_, i) => <Dot key={`r${i}`} />)}
          </div>
        )}
      </div>
    </div>
  );
}

interface OperandCardsProps {
  a: number;
  b: number;
  op: '+' | '-';
}

function MiniBlocks({ value }: { value: number }) {
  const rods = Math.floor(value / 10);
  const ones = value % 10;
  return (
    <div className="mini-blocks">
      <div className="mini-blocks__rods">{Array.from({ length: rods }).map((_, i) => <Rod key={i} />)}</div>
      <div className="mini-blocks__ones">{Array.from({ length: ones }).map((_, i) => <Dot key={i} />)}</div>
    </div>
  );
}

export function OperandCards({ a, b, op }: OperandCardsProps) {
  return (
    <div className="operands">
      <div className="operand-card">
        <span className="operand-card__num">{a}</span>
        <MiniBlocks value={a} />
      </div>
      <span className="operand-card__op">{op}</span>
      <div className="operand-card">
        <span className="operand-card__num">{b}</span>
        <MiniBlocks value={b} />
      </div>
    </div>
  );
}
