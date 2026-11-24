import type { ComponentPropsWithRef, ReactNode } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Checked (controlled). */
  checked?: boolean;
  /** Initial value (uncontrolled). */
  defaultChecked?: boolean;
  /** Figma `circle`. Round (`true`, Figma default) or rounded-square (`false`). Still a checkbox either way. @default true */
  circle?: boolean;
  /** Figma `disabled?`. Keeps the value, blocks changes. @default false */
  disabled?: boolean;
  /** Visible label next to the box. Without it, pass `aria-label`. */
  children?: ReactNode;
  /** Class on the outer `<label>` (`className` goes on the `<input>`). */
  wrapperClassName?: string;
}

/** Checkbox (Figma “Checkbox”). A native checkbox with Figma's checked artwork. */
export function Checkbox({ children, circle = true, disabled = false, wrapperClassName, className, ...rest }: CheckboxProps) {
  return (
    <label className={['dp-checkbox', circle ? 'dp-checkbox--circle' : 'dp-checkbox--square', disabled && 'dp-checkbox--disabled', wrapperClassName].filter(Boolean).join(' ')}>
      <input {...rest} type="checkbox" disabled={disabled} className={['dp-checkbox__input', className].filter(Boolean).join(' ')} />
      <span className="dp-checkbox__control" aria-hidden="true" />
      {children != null && <span className="dp-checkbox__label">{children}</span>}
    </label>
  );
}

export default Checkbox;
