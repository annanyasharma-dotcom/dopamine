import type { ComponentPropsWithRef } from 'react';
import './Logo.css';

/** Figma `colour`. */
export type LogoColour = 'black' | 'brand';

export interface LogoProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Figma `colour`. @default 'black' */
  colour?: LogoColour;
  /** Figma `inverse?`. White logo for dark or coloured backgrounds. Figma defines it for `brand` only. @default false */
  inverse?: boolean;
  /** Accessible name. @default 'TATA 1mg' */
  label?: string;
}

/** TATA 1mg logo (Figma “TATA 1mg logo”, 120×40). Shapes are the original Figma SVGs; colour comes from tokens. */
export function Logo({ colour = 'black', inverse = false, label = 'TATA 1mg', className, ...rest }: LogoProps) {
  const classes = ['dp-logo', `dp-logo--${inverse ? 'inverse' : colour}`, className].filter(Boolean).join(' ');
  return (
    <span {...rest} role="img" aria-label={label} className={classes}>
      <span className="dp-logo__part dp-logo__part--tata" />
      <span className="dp-logo__part dp-logo__part--1mg" />
    </span>
  );
}

export default Logo;
