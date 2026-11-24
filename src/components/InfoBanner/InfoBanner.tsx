import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import lightningTile from './assets/lightning-tile.svg';
import chevron from './assets/chevron.svg';
import './InfoBanner.css';

export interface InfoBannerProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'onClick'> {
  /** Message. Figma `content` (sample “Get medicines in under 30mins. Now in your locality”). */
  children: ReactNode;
  /**
   * Figma `icon` + slot. `true` shows Figma's purple lightning artwork; pass your own 40px node;
   * `false` hides it. @default true
   */
  icon?: boolean | ReactNode;
  /** Figma `actionButton`. Shows the trailing chevron. Use it only when the banner leads somewhere. @default true */
  chevron?: boolean;
  /** Makes the whole banner a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** Contextual service or promo strip (Figma “Info banner”). */
export function InfoBanner({ children, icon = true, chevron: showChevron = true, onClick, className, ...rest }: InfoBannerProps) {
  const inner = (
    <>
      {icon !== false && icon != null && (
        <span className="dp-info-banner__icon">{icon === true ? <img src={lightningTile} alt="" width={40} height={40} /> : icon}</span>
      )}
      <span className="dp-info-banner__text">{children}</span>
      {showChevron && <img className="dp-info-banner__chevron" src={chevron} alt="" width={16} height={16} />}
    </>
  );
  return (
    <div {...rest} className={['dp-info-banner', className].filter(Boolean).join(' ')}>
      {onClick ? (
        <button type="button" className="dp-info-banner__body" onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className="dp-info-banner__body">{inner}</div>
      )}
    </div>
  );
}

export default InfoBanner;
