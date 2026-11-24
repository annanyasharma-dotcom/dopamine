import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './Widget.css';

export interface WidgetProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  /** Section title. Figma: “Title”. */
  title: ReactNode;
  /** Optional subtitle. Figma `subtitle` (on by default in Figma); omit to hide. */
  subtitle?: ReactNode;
  /** Figma `chevron`. Shows the chevron, which is a button when `onChevronClick` is set. @default true */
  chevron?: boolean;
  /** Called when the chevron is pressed (open the section's full list). */
  onChevronClick?: () => void;
  /** Accessible name for the chevron button. @default 'See all' */
  chevronLabel?: string;
  /** Section content (Figma “List Items Content Slot”): SKUs, list items, grids… */
  children?: ReactNode;
}

export function Widget({ title, subtitle, chevron = true, onChevronClick, chevronLabel = 'See all', children, className, ...rest }: WidgetProps) {
  return (
    <section {...rest} className={['dp-widget', className].filter(Boolean).join(' ')}>
      <div className="dp-widget__header">
        <div className="dp-widget__titles">
          <h2 className="dp-widget__title">{title}</h2>
          {subtitle != null && <p className="dp-widget__subtitle">{subtitle}</p>}
        </div>
        {chevron &&
          (onChevronClick ? (
            <button type="button" className="dp-widget__chevron" onClick={onChevronClick} aria-label={chevronLabel}>
              <Icon name="chevron-right" />
            </button>
          ) : (
            <span className="dp-widget__chevron">
              <Icon name="chevron-right" />
            </span>
          ))}
      </div>
      <div className="dp-widget__content">{children}</div>
    </section>
  );
}

export default Widget;
