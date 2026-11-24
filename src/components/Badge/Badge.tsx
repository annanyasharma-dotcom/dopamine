import type { ComponentPropsWithRef, ReactNode } from 'react';
import './Badge.css';

/** Figma `colour`. Decorative only: none of these colours carries a status meaning. ('turquoise' = Figma “turquise”.) */
export type BadgeColour = 'pink' | 'mauve' | 'yellow' | 'red' | 'green' | 'orange' | 'blue' | 'turquoise' | 'gold';

export interface BadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Badge text. Figma: “Label”. */
  children: ReactNode;
  /** Figma `colour`. @default 'pink' */
  colour?: BadgeColour;
}

/** Short decorative label (Figma “Badge”). */
export function Badge({ children, colour = 'pink', className, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={['dp-badge', `dp-badge--${colour}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

export default Badge;
