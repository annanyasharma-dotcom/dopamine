import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import { Button } from '../Button';
import './Banner.css';

/** Figma `colour`. Figma spells the last one “mint-greene”; it is `mint-green` here. */
export type BannerColour = 'brand' | 'blue' | 'green' | 'brown' | 'pink' | 'mauve' | 'purple' | 'mint-green';

export interface BannerProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> {
  /** Title (Figma “List Heading Text”, h5 bold). */
  title: ReactNode;
  /** Subtitle (Figma `subtitle`, on by default in Figma). Omit to hide. */
  subtitle?: ReactNode;
  /** Figma `colour`: banner background. @default 'brand' */
  colour?: BannerColour;
  /**
   * CTA label (Figma `cta`, on by default in Figma). Omit to hide the button. Rendered with `Button`
   * (size sm, no icons): `black` on the brand banner, `inverse` on every other colour, as in Figma.
   */
  cta?: ReactNode;
  /** Called when the CTA is pressed. */
  onCtaClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Imagery for the Figma “img slot” (140px high, 115–151px wide, clipped): a 3D icon or illustration,
   * e.g. `<Hooman … />` or `<Illustration … />`. Fit it proportionally inside the slot.
   */
  image?: ReactNode;
}

/** Promo banner (Figma “banner”): title, subtitle and CTA beside an imagery slot, in 8 colours. */
export function Banner({ title, subtitle, colour = 'brand', cta, onCtaClick, image, className, ...rest }: BannerProps) {
  return (
    <div {...rest} className={['dp-banner', `dp-banner--${colour}`, className].filter(Boolean).join(' ')}>
      <div className="dp-banner__content">
        <div className="dp-banner__text">
          <p className="dp-banner__title">{title}</p>
          {subtitle != null && <p className="dp-banner__subtitle">{subtitle}</p>}
        </div>
        {cta != null && (
          <Button
            className="dp-banner__cta"
            variant={colour === 'brand' ? 'black' : 'inverse'}
            size="sm"
            leftIcon={false}
            rightIcon={false}
            onClick={onCtaClick}
          >
            {cta}
          </Button>
        )}
      </div>
      {/* Always rendered, as in Figma, so the text column keeps the same width with or without imagery. */}
      <div className="dp-banner__image">{image}</div>
    </div>
  );
}

export default Banner;
