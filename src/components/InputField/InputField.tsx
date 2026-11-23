import { useId, useRef, useState, type ChangeEvent, type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';
import './InputField.css';

/** Figma `state` success / error. The other Figma states (rest, active, typing, typed, disabled) come from focus, value and `disabled`. */
export type InputFieldStatus = 'default' | 'success' | 'error';

export interface InputFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'children'> {
  /** Field label shown in the chip on the top border. Figma: "Label". */
  label: ReactNode;
  /** Supporting text under the field; turns green/red with `status`. Figma `helper` + `helperText`. Omit to hide. */
  helperText?: ReactNode;
  /** Validation status. Figma `state` = success / error. @default 'default' */
  status?: InputFieldStatus;
  /** Show the clear (×) button. Figma shows it in every state. @default true */
  clearable?: boolean;
  /** Called after the clear button is pressed. In controlled mode, set `value` to '' here. */
  onClear?: () => void;
  /** Extra class on the outer wrapper (`className` goes on the `<input>`). */
  wrapperClassName?: string;
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

export function InputField({
  label,
  helperText,
  status = 'default',
  clearable = true,
  onClear,
  wrapperClassName,
  className,
  id,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: InputFieldProps) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const helperId = `${autoId}-helper`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInnerValue(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    if (!isControlled) setInnerValue('');
    onClear?.();
    inputRef.current?.focus();
  }

  const describedBy = [helperText != null ? helperId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const wrapperClasses = ['dp-input-field', `dp-input-field--${status}`, disabled && 'dp-input-field--disabled', wrapperClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <label className="dp-input-field__label" htmlFor={inputId}>
        <span className="dp-input-field__label-text">{label}</span>
        {required && (
          <span className="dp-input-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="dp-input-field__control">
        <input
          {...rest}
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          id={inputId}
          className={['dp-input-field__input', className].filter(Boolean).join(' ')}
          value={isControlled ? value : innerValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={describedBy}
        />
        {clearable && (
          <button type="button" className="dp-input-field__clear" onClick={handleClear} disabled={disabled} aria-label="Clear">
            <span className="dp-input-field__clear-icon" aria-hidden="true" />
          </button>
        )}
      </div>

      {helperText != null && (
        <div id={helperId} className="dp-input-field__helper">
          {helperText}
        </div>
      )}
    </div>
  );
}

export default InputField;
