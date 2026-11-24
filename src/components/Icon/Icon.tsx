import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { icons, type IconName } from './icons';
import './Icon.css';

export interface IconProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Which icon to show. See `iconNames` for the full list. */
  name: IconName;
  /** Size in px (square). Defaults to the icon's native Figma size. */
  size?: number;
  /**
   * Icon colour (any CSS colour, ideally a token such as `var(--icon-brand-coral)`).
   * Defaults to the icon's colour in Figma. Use `'currentColor'` to follow the text colour.
   */
  color?: string;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

export function Icon({ name, size, color, label, className, style, ...rest }: IconProps) {
  const icon = icons[name];
  const width = size ?? icon.width;
  const height = size ?? icon.height;

  return (
    <span
      {...rest}
      className={['dp-icon', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={
        {
          '--dp-icon-src': `url("${icon.src}")`,
          '--dp-icon-color': color ?? icon.defaultColor,
          width,
          height,
          ...style,
        } as CSSProperties
      }
    />
  );
}

export default Icon;
