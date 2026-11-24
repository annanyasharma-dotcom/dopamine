import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import { Icon } from '../Icon';
import './SpecialButton.css';

export interface SpecialButtonProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'onClick'> {
  /** Coupon amount or savings, e.g. “₹80”. */
  children: ReactNode;
  /** Shows the chevron. Use it only when coupon details or an action are available. @default true */
  chevron?: boolean;
  /** Makes it a button (open coupon details, copy or apply a code — your flow decides). */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** Coupon highlight chip (Figma “special button”). A `<button>` when `onClick` is set, otherwise a label. */
export function SpecialButton({ children, chevron = true, onClick, className, ...rest }: SpecialButtonProps) {
  const classes = ['dp-special-button', className].filter(Boolean).join(' ');
  const content = (
    <>
      {children}
      {chevron && <Icon name="chevron-right-small" />}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...(rest as ComponentPropsWithRef<'button'>)}>
        {content}
      </button>
    );
  }
  return (
    <span {...rest} className={classes}>
      {content}
    </span>
  );
}

export default SpecialButton;
