import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { hoomans, type HoomanName } from './hoomans';
import './Hooman.css';

export interface HoomanProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Which character and pose, as `<character>-<pose>`. See `hoomanNames`. */
  name: HoomanName;
  /** Rendered height in px; the width follows the image's aspect ratio. @default 240 */
  height?: number;
  /** Accessible name. Without it the hooman is decorative (Figma: “supporting imagery”). */
  label?: string;
}

/** TATA 1mg character illustration (“hooman”). Full-colour image; can't be recoloured. */
export function Hooman({ name, height = 240, label, className, style, ...rest }: HoomanProps) {
  const def = hoomans[name];
  const width = Math.round((height * def.width) / def.height);
  return (
    <span
      {...rest}
      className={['dp-hooman', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ width, height, ...style } as CSSProperties}
    >
      <img className="dp-hooman__img" src={def.src} alt="" width={width} height={height} decoding="async" />
    </span>
  );
}

export default Hooman;
