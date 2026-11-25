import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { illustrations, type IllustrationName } from './illustrations';
import testubesA from './images/testubes-a.png';
import testubesB from './images/testubes-b.png';
import testubesMask from './images/testubes-mask.svg';
import './Illustration.css';

export interface IllustrationProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Which illustration. See `illustrationNames`. */
  name: IllustrationName;
  /** Rendered size in px (square). The Figma frame is 120. @default 120 */
  size?: number;
  /** Accessible name. Without it the illustration is decorative (Figma: “supporting imagery”). */
  label?: string;
}

/** Full-colour illustration from the Figma icon repo, drawn on a 120×120 frame and scaled to `size`. */
export function Illustration({ name, size = 120, label, className, style, ...rest }: IllustrationProps) {
  const def = illustrations[name];
  return (
    <span
      {...rest}
      className={['dp-illustration', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ width: size, height: size, ...style } as CSSProperties}
    >
      <span className={`dp-illustration__frame dp-illustration__frame--${name}`} style={{ transform: `scale(${size / 120})` }}>
        {name === 'testubes' ? (
          // Figma composite: two rotated tube images, each cut by the same soft mask.
          <>
            <span className="dp-illustration__tube dp-illustration__tube--a" style={{ '--dp-mask': `url("${testubesMask}")` } as CSSProperties}>
              <img src={testubesA} alt="" />
            </span>
            <span className="dp-illustration__tube dp-illustration__tube--b" style={{ '--dp-mask': `url("${testubesMask}")` } as CSSProperties}>
              <img src={testubesB} alt="" />
            </span>
          </>
        ) : (
          <img className="dp-illustration__img" src={'src' in def ? def.src : undefined} alt="" />
        )}
      </span>
    </span>
  );
}

export default Illustration;
