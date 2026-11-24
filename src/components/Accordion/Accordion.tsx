import { useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Icon } from '../Icon';
import './Accordion.css';

export interface AccordionProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Question / heading. Figma sample: “What does CBC (Complete Blood Count) measure?” */
  title: ReactNode;
  /** Answer content (Figma “Slot”). */
  children: ReactNode;
  /** Open state (controlled). Figma `state` rest = closed, expanded / more expanded = open. */
  expanded?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultExpanded?: boolean;
  /** Called with the new open state when the header is pressed. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Lines shown before “see more” (Figma `expanded` shows 6). “see more” reveals the rest
   * (Figma `more expanded`). It only appears when the content is longer. `0` = never clamp. @default 6
   */
  lines?: number;
  /** Text of the reveal link. @default 'see more' */
  seeMoreLabel?: string;
}

/** Expandable question/answer row (Figma “Accordian”). */
export function Accordion({
  title,
  children,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  lines = 6,
  seeMoreLabel = 'see more',
  className,
  ...rest
}: AccordionProps) {
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const isOpen = expanded ?? innerExpanded;
  const clamped = isOpen && lines > 0 && !showAll;

  // Only offer “see more” when the clamped text is actually cut off.
  useLayoutEffect(() => {
    const el = contentRef.current;
    setOverflowing(Boolean(el && clamped && el.scrollHeight > el.clientHeight + 1));
  }, [clamped, children, lines]);

  function toggle() {
    const next = !isOpen;
    if (expanded === undefined) setInnerExpanded(next);
    if (!next) setShowAll(false);
    onExpandedChange?.(next);
  }

  const state = !isOpen ? 'rest' : showAll || !overflowing ? 'more-expanded' : 'expanded';

  return (
    <div {...rest} className={['dp-accordion', `dp-accordion--${state}`, isOpen && 'dp-accordion--open', className].filter(Boolean).join(' ')}>
      <button type="button" className="dp-accordion__header" aria-expanded={isOpen} aria-controls={`${id}-panel`} id={`${id}-header`} onClick={toggle}>
        <span className="dp-accordion__title">{title}</span>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
      </button>
      {isOpen && (
        <div className="dp-accordion__panel" id={`${id}-panel`} role="region" aria-labelledby={`${id}-header`}>
          <div ref={contentRef} className={['dp-accordion__content', clamped && 'dp-accordion__content--clamped'].filter(Boolean).join(' ')} style={clamped ? { WebkitLineClamp: lines } : undefined}>
            {children}
          </div>
          {clamped && overflowing && (
            <button type="button" className="dp-accordion__see-more" onClick={() => setShowAll(true)}>
              {seeMoreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Accordion;
