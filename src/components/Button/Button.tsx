import type { ComponentPropsWithRef, ReactNode } from 'react';
import './Button.css';

export type ButtonSize = 'sm' | 'lg';
/** Figma property `type`. Named `variant` here so the native `type` attribute (button/submit/reset) stays available. */
export type ButtonVariant = 'brand' | 'black' | 'outline' | 'inverse' | 'ghost';

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Button label. Figma: the "Button" text layer. */
  children: ReactNode;
  /** Figma `type`. Visual treatment. @default 'brand' */
  variant?: ButtonVariant;
  /** Figma `size`. sm = 44px high, 14px text; lg = 56px high, 16px text. @default 'sm' */
  size?: ButtonSize;
  /** Figma `disabled?`. Prevents activation and applies the disabled treatment. @default false */
  disabled?: boolean;
  /**
   * Figma `leftIcon`. `true` shows the arrow-left icon from the design, `false` hides it,
   * or pass your own 24px icon (use `currentColor` so it picks up the variant's icon colour).
   * @default true
   */
  leftIcon?: boolean | ReactNode;
  /** Figma `rightIcon`. Same as `leftIcon`, with the arrow-right icon. @default true */
  rightIcon?: boolean | ReactNode;
}

function IconSlot({ icon, fallback }: { icon: boolean | ReactNode; fallback: 'left' | 'right' }) {
  if (icon === false || icon === null || icon === undefined) return null;
  return (
    <span className="dp-button__icon" aria-hidden="true">
      {icon === true ? <span className={`dp-button__arrow dp-button__arrow--${fallback}`} /> : icon}
    </span>
  );
}

export function Button({
  children,
  variant = 'brand',
  size = 'sm',
  disabled = false,
  leftIcon = true,
  rightIcon = true,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const classes = ['dp-button', `dp-button--${variant}`, `dp-button--${size}`, className].filter(Boolean).join(' ');

  return (
    <button {...rest} type={type} disabled={disabled} className={classes}>
      <IconSlot icon={leftIcon} fallback="left" />
      <span className="dp-button__label">{children}</span>
      <IconSlot icon={rightIcon} fallback="right" />
    </button>
  );
}

export default Button;
