import { t, type Lang } from '../i18n';
import { BackspaceIcon, CheckIcon } from './Icons';

interface KeypadProps {
  lang: Lang;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function Keypad({ lang, onDigit, onBackspace, onSubmit, disabled = false }: KeypadProps) {
  return (
    <div className={`keypad ${disabled ? 'is-disabled' : ''}`}>
      {DIGITS.map((digit) => (
        <button key={digit} type="button" className="key" onClick={() => onDigit(digit)} disabled={disabled}>
          {digit}
        </button>
      ))}
      <button type="button" className="key key--soft" onClick={onBackspace} aria-label={t(lang, 'backspace')} disabled={disabled}>
        <BackspaceIcon size={30} />
      </button>
      <button type="button" className="key" onClick={() => onDigit('0')} disabled={disabled}>
        0
      </button>
      <button type="button" className="key key--check" onClick={onSubmit} aria-label={t(lang, 'check')} disabled={disabled}>
        <CheckIcon size={34} />
      </button>
    </div>
  );
}
