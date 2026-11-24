import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import './Tag.css';

/** Figma `.Tags` › `State`. */
export type TagType = 'bestseller' | 'previously-bought' | 'promoted' | 'sold-out';

export interface TagProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Figma `State`: Bestseller, Previously Bought, Promoted (“1mg’s choice”), Sold Out. @default 'bestseller' */
  type?: TagType;
  /** Override the text. Defaults to the Figma copy for the type. */
  label?: ReactNode;
}

const tagContent: Record<TagType, { label: string; icon?: IconName }> = {
  bestseller: { label: 'Bestseller', icon: 'bestseller' },
  'previously-bought': { label: 'Previously bought', icon: 'restart' },
  promoted: { label: '1mg’s choice', icon: 'good-experience' },
  'sold-out': { label: 'Sold out' },
};

export function Tag({ type = 'bestseller', label, className, ...rest }: TagProps) {
  const content = tagContent[type];
  return (
    <span {...rest} className={['dp-tag', `dp-tag--${type}`, className].filter(Boolean).join(' ')}>
      {content.icon && <Icon name={content.icon} color="currentColor" />}
      {label ?? content.label}
    </span>
  );
}

export default Tag;
