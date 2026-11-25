import type { ComponentPropsWithRef } from 'react';
import './Divider.css';

/** Figma `style`. Named `variant` here because `style` is React's inline-style prop. */
export type DividerVariant = 'plain' | 'dash';

export interface DividerProps extends Omit<ComponentPropsWithRef<'hr'>, 'children'> {
  /** `plain` between sections, `dash` between individual SKUs (Figma guidance). @default 'plain' */
  variant?: DividerVariant;
}

/** 1px separator line (Figma “divider”). Renders an `<hr>`. */
export function Divider({ variant = 'plain', className, ...rest }: DividerProps) {
  return <hr {...rest} className={['dp-divider', `dp-divider--${variant}`, className].filter(Boolean).join(' ')} />;
}

export default Divider;
