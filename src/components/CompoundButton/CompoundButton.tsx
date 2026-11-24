import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './CompoundButton.css';

export interface CompoundButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Small first line. Figma sample: “Upload”. */
  label: ReactNode;
  /** Bold second line. Figma sample: “Prescription”. */
  children: ReactNode;
  /** Icon in the coral pill. Defaults to Figma's upload icon; pass `false` to hide. @default the upload icon */
  icon?: ReactNode | false;
}

/** Two-line pill button with a coral icon (Figma “compount button”). */
export function CompoundButton({ label, children, icon, type = 'button', className, ...rest }: CompoundButtonProps) {
  return (
    <button {...rest} type={type} className={['dp-compound-button', className].filter(Boolean).join(' ')}>
      {icon !== false && (
        <span className="dp-compound-button__icon" aria-hidden="true">
          {icon ?? <Icon name="upload" />}
        </span>
      )}
      <span className="dp-compound-button__text">
        <span className="dp-compound-button__label">{label}</span>
        <span className="dp-compound-button__title">{children}</span>
      </span>
    </button>
  );
}

export default CompoundButton;
