import type { ComponentPropsWithRef, ReactNode } from 'react';
import { CounterBadge } from '../CounterBadge';
import { Icon } from '../Icon';
import './Chip.css';

export interface ChipProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Chip text. Figma: “Label”. */
  children: ReactNode;
  /**
   * Figma `inverse`. `true` (Figma default) = light chip: white with a border and dark text;
   * `false` = dark filled chip. Neither means “selected”. @default true
   */
  inverse?: boolean;
  /** Figma `diabled?`. @default false */
  disabled?: boolean;
  /** Figma `leftIcon`. `true` shows the arrow-left icon, `false` hides it, or pass your own 16px icon. @default true */
  leftIcon?: boolean | ReactNode;
  /** Figma `rightIcon` (the count bubble, sample “1”). Shown when set. */
  count?: number;
}

/** Compact action or filter chip (Figma “Chip”). Renders a `<button>`. */
export function Chip({ children, inverse = true, disabled = false, leftIcon = true, count, type = 'button', className, ...rest }: ChipProps) {
  const tone = disabled ? 'disabled' : inverse ? 'light' : 'dark';
  return (
    <button {...rest} type={type} disabled={disabled} className={['dp-chip', `dp-chip--${tone}`, className].filter(Boolean).join(' ')}>
      {leftIcon === true ? <Icon name="arrow-left" color="currentColor" /> : leftIcon || null}
      <span className="dp-chip__label">{children}</span>
      {count != null && <CounterBadge className="dp-chip__count" count={count} />}
    </button>
  );
}

export default Chip;
