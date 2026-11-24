import type { ComponentPropsWithRef } from 'react';
import { Icon } from '../Icon';
import './Rating.css';

/** Figma `type`: the product-defined score band. */
export type RatingType = 'good' | 'avg' | 'bad';

export interface RatingProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** The rating shown, e.g. 4.5. Figma samples: 4.5 / 3.5 / 2.5. */
  value: number | string;
  /** Figma `type`. Colour band; choose it from your product's banding rules. @default 'good' */
  type?: RatingType;
}

export function Rating({ value, type = 'good', className, ...rest }: RatingProps) {
  return (
    <span {...rest} className={['dp-rating', `dp-rating--${type}`, className].filter(Boolean).join(' ')}>
      <Icon name="star" />
      <span className="dp-rating__sr-only">Rated </span>
      {value}
    </span>
  );
}

export default Rating;
