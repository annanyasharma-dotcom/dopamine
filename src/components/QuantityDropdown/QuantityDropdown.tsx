import { useState, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import './QuantityDropdown.css';

export interface QuantityDropdownProps extends Omit<ComponentPropsWithRef<'select'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'multiple' | 'children'> {
  /** Selected quantity (controlled). Figma sample: 1. */
  value?: number;
  /** Initial quantity (uncontrolled). @default first option */
  defaultValue?: number;
  /** Called with the chosen quantity. */
  onChange?: (quantity: number) => void;
  /** Quantities to offer. Set from your cart rules (stock, purchase limits). @default 1–10 */
  options?: number[];
  /** Accessible name. @default 'Quantity' */
  'aria-label'?: string;
  /** Class on the visible control (`className` goes on the `<select>`). */
  wrapperClassName?: string;
}

const defaultOptions = Array.from({ length: 10 }, (_, i) => i + 1);

/**
 * Cart quantity picker (Figma “dropdown”). A native `<select>` sits over the Figma design,
 * so phones open their own picker and keyboards work as usual.
 */
export function QuantityDropdown({
  value,
  defaultValue,
  onChange,
  options = defaultOptions,
  'aria-label': ariaLabel = 'Quantity',
  wrapperClassName,
  className,
  disabled,
  ...rest
}: QuantityDropdownProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]);
  const current = value ?? inner;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = Number(event.target.value);
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  return (
    <span className={['dp-quantity', disabled && 'dp-quantity--disabled', wrapperClassName].filter(Boolean).join(' ')}>
      <span className="dp-quantity__value" aria-hidden="true">
        {current}
      </span>
      <span className="dp-quantity__caret" aria-hidden="true" />
      <select {...rest} aria-label={ariaLabel} className={['dp-quantity__select', className].filter(Boolean).join(' ')} value={current} onChange={handleChange} disabled={disabled}>
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </span>
  );
}

export default QuantityDropdown;
