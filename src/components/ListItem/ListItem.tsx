import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import { Icon } from '../Icon';
import './ListItem.css';

export interface ListItemProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'onClick'> {
  /** Main text. Figma `t1` (sample “This is a title”). Omit to hide. */
  title?: ReactNode;
  /** Supporting text. Figma `t2` (sample “This is a subtitle”). Omit to hide. */
  subtitle?: ReactNode;
  /**
   * Figma `img`. `true` shows the 44px placeholder block from Figma; pass a node (image, icon)
   * to render it in the 44px slot; `false` hides it. @default true
   */
  media?: boolean | ReactNode;
  /** Figma `icon`. Shows the trailing chevron. @default true */
  chevron?: boolean;
  /** Makes the whole item a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** List item from the Figma “list” component. */
export function ListItem({ title, subtitle, media = true, chevron = true, onClick, className, ...rest }: ListItemProps) {
  const classes = ['dp-list-item', onClick && 'dp-list-item--interactive', className].filter(Boolean).join(' ');
  const content = (
    <>
      {media !== false && media != null && (
        <span className={['dp-list-item__media', media === true && 'dp-list-item__media--placeholder'].filter(Boolean).join(' ')} aria-hidden={media === true || undefined}>
          {media === true ? null : media}
        </span>
      )}
      <span className="dp-list-item__text">
        {title != null && <span className="dp-list-item__title">{title}</span>}
        {subtitle != null && <span className="dp-list-item__subtitle">{subtitle}</span>}
      </span>
      {chevron && <Icon name="chevron-right" />}
    </>
  );

  return (
    <div {...rest} className={classes}>
      {onClick ? (
        <button type="button" className="dp-list-item__body" onClick={onClick}>
          {content}
        </button>
      ) : (
        <div className="dp-list-item__body">{content}</div>
      )}
    </div>
  );
}

export default ListItem;
