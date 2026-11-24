import type { ComponentPropsWithRef, ReactNode } from 'react';
import './Toggle.css';

export interface ToggleProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** On/off value (controlled). Figma `state`: active = on. */
  checked?: boolean;
  /** Initial value (uncontrolled). */
  defaultChecked?: boolean;
  /** Figma `disabled`. Keeps the value, blocks changes. @default false */
  disabled?: boolean;
  /** Visible label next to the switch. Without it, pass `aria-label`. */
  children?: ReactNode;
  /** Class on the outer `<label>` (`className` goes on the `<input>`). */
  wrapperClassName?: string;
}

/** On/off switch (Figma “Toggle”). A native checkbox with `role="switch"`. */
export function Toggle({ children, disabled = false, wrapperClassName, className, ...rest }: ToggleProps) {
  return (
    <label className={['dp-toggle', disabled && 'dp-toggle--disabled', wrapperClassName].filter(Boolean).join(' ')}>
      <input {...rest} type="checkbox" role="switch" disabled={disabled} className={['dp-toggle__input', className].filter(Boolean).join(' ')} />
      <span className="dp-toggle__track" aria-hidden="true">
        <span className="dp-toggle__thumb" />
      </span>
      {children != null && <span className="dp-toggle__label">{children}</span>}
    </label>
  );
}

export default Toggle;
