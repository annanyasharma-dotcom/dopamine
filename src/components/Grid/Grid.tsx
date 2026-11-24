import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import './Grid.css';

export interface GridItemProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'onClick'> {
  /** Label under the tile, up to 2 lines. Figma `title` (sample “Reorder Medicines”). */
  title: ReactNode;
  /** Content of the 40px tile (Figma “Slot”), e.g. an icon or illustration. */
  children?: ReactNode;
  /** Makes the item a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** One shortcut tile (Figma “.grid”), 70×76. */
export function GridItem({ title, children, onClick, className, ...rest }: GridItemProps) {
  const inner = (
    <>
      <span className="dp-grid-item__slot">{children}</span>
      <span className="dp-grid-item__title">{title}</span>
    </>
  );
  return (
    <div {...rest} className={['dp-grid-item', className].filter(Boolean).join(' ')}>
      {onClick ? (
        <button type="button" className="dp-grid-item__body" onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className="dp-grid-item__body">{inner}</div>
      )}
    </div>
  );
}

export type GridProps = ComponentPropsWithRef<'div'>;

/** Row of shortcut tiles (Figma “grid”), 16px apart. Put `GridItem`s inside. */
export function Grid({ className, ...rest }: GridProps) {
  return <div {...rest} className={['dp-grid', className].filter(Boolean).join(' ')} />;
}

export default Grid;
