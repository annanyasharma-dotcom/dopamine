import type { ComponentPropsWithRef } from 'react';
import './CounterBadge.css';

/** Figma `colour`. */
export type CounterBadgeColour = 'brand' | 'blue' | 'green';

export interface CounterBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** The number to show. Figma: the "3" text layer. */
  count: number;
  /** Figma `colour`. @default 'brand' */
  colour?: CounterBadgeColour;
  /** Figma `disabled?`. Muted grey treatment. @default false */
  disabled?: boolean;
  /** Counts above this show as "{max}+" so the badge stays small. @default 99 */
  max?: number;
}

export function CounterBadge({ count, colour = 'brand', disabled = false, max = 99, className, ...rest }: CounterBadgeProps) {
  const text = count > max ? `${max}+` : String(count);
  const classes = ['dp-counter-badge', `dp-counter-badge--${colour}`, disabled && 'dp-counter-badge--disabled', className].filter(Boolean).join(' ');

  // With an aria-label the badge is announced as one labelled image ("3 unread messages");
  // without one, the number is read as plain text.
  return (
    <span {...rest} role={rest['aria-label'] ? 'img' : rest.role} className={classes}>
      {text}
    </span>
  );
}

export default CounterBadge;
