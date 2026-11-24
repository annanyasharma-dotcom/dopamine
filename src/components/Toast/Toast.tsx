import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './Toast.css';

/** Figma `type`. */
export type ToastType = 'warning' | 'error' | 'success' | 'info' | 'white';

export interface ToastProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Figma `type`. @default 'warning' */
  type?: ToastType;
  /** Message. Figma `label` (sample: “Short message displayed here.”). */
  label: ReactNode;
  /** Figma `icon`. Shows the status (info) icon. @default true */
  icon?: boolean;
  /** Figma `cross`. Shows the dismiss (×) button. @default true */
  cross?: boolean;
  /** Called when × is pressed. */
  onDismiss?: () => void;
  /** Action text, e.g. “Undo”. Setting it shows the action (Figma `action text` = true). */
  actionLabel?: string;
  /** Called when the action is pressed. */
  onAction?: () => void;
}

export function Toast({
  type = 'warning',
  label,
  icon = true,
  cross = true,
  onDismiss,
  actionLabel,
  onAction,
  className,
  ...rest
}: ToastProps) {
  const classes = ['dp-toast', `dp-toast--${type}`, className].filter(Boolean).join(' ');
  const hasActions = actionLabel != null || cross;

  return (
    <div {...rest} role={type === 'error' ? 'alert' : 'status'} className={classes}>
      {icon && (
        <span className="dp-toast__icon" aria-hidden="true">
          <Icon name="info" color="var(--dp-toast-icon)" />
        </span>
      )}
      <p className="dp-toast__label">{label}</p>
      {hasActions && (
        <div className="dp-toast__actions">
          {actionLabel != null && (
            <button type="button" className="dp-toast__action" onClick={onAction}>
              {actionLabel}
            </button>
          )}
          {cross && (
            <button type="button" className="dp-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
              <Icon name="close" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Toast;
