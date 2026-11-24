import { useEffect, useId, useRef, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button';
import { Icon } from '../Icon';
import './BottomSheet.css';

/** A sheet action: any Button props; the sheet sets the variant (secondary = outline, primary = brand). */
export type BottomSheetAction = Omit<ButtonProps, 'variant'>;

export interface BottomSheetProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Whether the sheet is shown. @default true */
  open?: boolean;
  /** Called by the close button, the Escape key and a tap on the dimmed backdrop. */
  onClose?: () => void;
  /** Sheet heading. Setting it shows the header (Figma `header`). */
  heading?: ReactNode;
  /** Text under the heading. */
  subheading?: ReactNode;
  /** Left, outline button (Figma “Secondary Action Button”). Setting either action shows the footer (Figma `cta`). */
  secondaryAction?: BottomSheetAction;
  /** Right, brand button (Figma “Primary Action Button”). */
  primaryAction?: BottomSheetAction;
  /** Accessible name of the close button. @default 'Close' */
  closeLabel?: string;
  /** Sheet content (Figma “Content Container Slot”). */
  children?: ReactNode;
}

export function BottomSheet({
  open = true,
  onClose,
  heading,
  subheading,
  secondaryAction,
  primaryAction,
  closeLabel = 'Close',
  children,
  className,
  ...rest
}: BottomSheetProps) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the sheet when it opens and give it back when it closes; close on Escape.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const onBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return (
    <div {...rest} className={['dp-bottom-sheet', className].filter(Boolean).join(' ')} onClick={onBackdropClick}>
      <div className="dp-bottom-sheet__dismiss" onClick={onBackdropClick}>
        <button ref={closeRef} type="button" className="dp-bottom-sheet__close" onClick={onClose} aria-label={closeLabel}>
          <Icon name="close-filled" />
        </button>
      </div>

      <div className="dp-bottom-sheet__sheet" role="dialog" aria-modal="true" aria-labelledby={heading != null ? headingId : undefined} aria-label={heading == null ? 'Bottom sheet' : undefined}>
        {heading != null && (
          <div className="dp-bottom-sheet__header">
            <h2 id={headingId} className="dp-bottom-sheet__heading">
              {heading}
            </h2>
            {subheading != null && <p className="dp-bottom-sheet__subheading">{subheading}</p>}
          </div>
        )}

        <div className="dp-bottom-sheet__content">{children}</div>

        {(secondaryAction || primaryAction) && (
          <div className="dp-bottom-sheet__actions">
            {secondaryAction && (
              <Button {...secondaryAction} variant="outline" className={['dp-bottom-sheet__action', secondaryAction.className].filter(Boolean).join(' ')} />
            )}
            {primaryAction && (
              <Button {...primaryAction} variant="brand" className={['dp-bottom-sheet__action', primaryAction.className].filter(Boolean).join(' ')} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomSheet;
