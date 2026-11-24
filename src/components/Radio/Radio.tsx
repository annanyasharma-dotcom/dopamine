import type { ComponentPropsWithRef, ReactNode } from 'react';
import './Radio.css';

export interface RadioProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Selected (controlled). Figma `selected?`. Group radios with the same `name`. */
  checked?: boolean;
  /** Figma `disabled?`. @default false */
  disabled?: boolean;
  /** Visible label next to the radio. Without it, pass `aria-label`. */
  children?: ReactNode;
  /** Class on the outer `<label>` (`className` goes on the `<input>`). */
  wrapperClassName?: string;
}

/** Radio button (Figma “Radio Button”). A native radio input with Figma's artwork. */
export function Radio({ children, disabled = false, wrapperClassName, className, ...rest }: RadioProps) {
  return (
    <label className={['dp-radio', disabled && 'dp-radio--disabled', wrapperClassName].filter(Boolean).join(' ')}>
      <input {...rest} type="radio" disabled={disabled} className={['dp-radio__input', className].filter(Boolean).join(' ')} />
      <span className="dp-radio__control" aria-hidden="true" />
      {children != null && <span className="dp-radio__label">{children}</span>}
    </label>
  );
}

export default Radio;
