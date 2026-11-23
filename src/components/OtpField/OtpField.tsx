import { useId, useLayoutEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import './OtpField.css';

/** Figma `digits`: "4 digit OTP" → 4, "6 digit OTP" → 6. */
export type OtpFieldDigits = 4 | 6;
/** Figma `state` error / success. rest, typing and typed come from focus and value; disabled from `disabled`. */
export type OtpFieldStatus = 'default' | 'success' | 'error';

export interface OtpFieldProps {
  /** Number of digit boxes. Figma `digits`. @default 4 */
  digits?: OtpFieldDigits;
  /** Entered code (controlled). Digits only; extra characters are ignored. */
  value?: string;
  /** Initial code (uncontrolled). */
  defaultValue?: string;
  /** Called with the full code string whenever it changes. */
  onChange?: (value: string) => void;
  /** Called with the code once every box is filled. */
  onComplete?: (value: string) => void;
  /** Verification result. Figma `state` = success / error. @default 'default' */
  status?: OtpFieldStatus;
  /** Prevents editing. Figma `state` = disabled. @default false */
  disabled?: boolean;
  /** Text under the boxes; green/red with `status`. Figma `helper` (off by default). Omit to hide. */
  helperText?: ReactNode;
  /** Shows the "Didn't receive OTP? Resend OTP" row and is called when Resend is pressed. Figma `state` = resend OTP. */
  onResend?: () => void;
  /** Text before the resend action. @default 'Didn’t receive OTP?' */
  resendPrompt?: ReactNode;
  /** Resend action label. @default 'Resend OTP' */
  resendLabel?: ReactNode;
  /** Accessible name for the group of boxes. @default 'One-time code' */
  'aria-label'?: string;
  /** Focus the first box on mount. @default false */
  autoFocus?: boolean;
  /** Name for the hidden input that carries the code in a form. */
  name?: string;
  /** Extra class on the outer wrapper. */
  className?: string;
}

const onlyDigits = (s: string) => s.replace(/\D/g, '');

export function OtpField({
  digits = 4,
  value,
  defaultValue,
  onChange,
  onComplete,
  status = 'default',
  disabled = false,
  helperText,
  onResend,
  resendPrompt = 'Didn’t receive OTP?',
  resendLabel = 'Resend OTP',
  'aria-label': ariaLabel = 'One-time code',
  autoFocus = false,
  name,
  className,
}: OtpFieldProps) {
  const helperId = `${useId()}-helper`;
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(() => onlyDigits(defaultValue ?? '').slice(0, digits));
  const code = onlyDigits(isControlled ? value : innerValue).slice(0, digits);
  // Latest code, readable by focus handlers before React re-renders.
  const latestCode = useRef(code);
  useLayoutEffect(() => {
    latestCode.current = code;
  }, [code]);

  const focusBox = (index: number) => {
    const box = inputs.current[Math.max(0, Math.min(index, digits - 1))];
    box?.focus();
    box?.select();
  };

  function commit(next: string) {
    const clean = onlyDigits(next).slice(0, digits);
    if (clean === code) return;
    latestCode.current = clean;
    if (!isControlled) setInnerValue(clean);
    onChange?.(clean);
    if (clean.length === digits) onComplete?.(clean);
  }

  /** Writes `text` starting at box `index` (typing, paste and autofill all go through here). */
  function fillFrom(index: number, text: string) {
    const incoming = onlyDigits(text);
    if (!incoming) return;
    const start = Math.min(index, code.length);
    const next = (code.slice(0, start) + incoming + code.slice(start + incoming.length)).slice(0, digits);
    commit(next);
    focusBox(start + incoming.length);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const typed = event.target.value;
    if (typed === '') {
      commit(code.slice(0, index) + code.slice(index + 1));
      return;
    }
    // A box shows one digit; if a second one lands next to it, keep the new one.
    const incoming = typed.length === 2 && code[index] && typed.includes(code[index]) ? typed.replace(code[index], '') : typed;
    fillFrom(index, incoming);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      event.preventDefault();
      commit(code.slice(0, index - 1) + code.slice(index));
      focusBox(index - 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(Math.min(index + 1, code.length));
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    fillFrom(index, event.clipboardData.getData('text'));
  }

  const classes = ['dp-otp-field', `dp-otp-field--${status}`, disabled && 'dp-otp-field--disabled', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="dp-otp-field__digits" role="group" aria-label={ariaLabel} aria-describedby={helperText != null ? helperId : undefined}>
        {Array.from({ length: digits }, (_, i) => (
          <input
            key={i}
            ref={(node) => {
              inputs.current[i] = node;
            }}
            className="dp-otp-field__digit"
            value={code[i] ?? ''}
            placeholder="-"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && i === 0}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${digits}`}
            aria-invalid={status === 'error' || undefined}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => {
              // Boxes fill left to right: focusing past the first empty box moves there.
              const filled = latestCode.current.length;
              if (i > filled) focusBox(filled);
              else e.target.select();
            }}
          />
        ))}
      </div>
      {name && <input type="hidden" name={name} value={code} />}

      {helperText != null && (
        <div id={helperId} className="dp-otp-field__helper">
          {helperText}
        </div>
      )}

      {onResend && (
        <div className="dp-otp-field__resend">
          <span className="dp-otp-field__resend-prompt">{resendPrompt}</span>
          <button type="button" className="dp-otp-field__resend-button" onClick={onResend} disabled={disabled}>
            <span className="dp-otp-field__resend-icon" aria-hidden="true" />
            {resendLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default OtpField;
