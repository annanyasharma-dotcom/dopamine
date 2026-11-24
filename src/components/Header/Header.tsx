import type { ComponentPropsWithRef, ReactNode } from 'react';
import { CounterBadge } from '../CounterBadge';
import './Header.css';

export interface HeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'children'> {
  /**
   * Figma `statusBar`. Shows the illustrative phone status bar (time, signal, battery).
   * Off by default: Figma's guidance is to let the operating system draw the real one.
   * Turn on for mock-ups and prototypes. @default false
   */
  statusBar?: boolean;
  /** Delivery-location name in the pill, e.g. "Office". Figma sample: "Office". */
  locationLabel: ReactNode;
  /** Address after the name; truncated with "…" when long. Figma sample: "3rd floor, Motorola…". */
  locationAddress?: ReactNode;
  /** Called when the location pill is pressed (open the address picker). */
  onLocationClick?: () => void;
  /** Figma `profile`. Shows the profile button. @default true */
  profile?: boolean;
  /** Called when the profile button is pressed. */
  onProfileClick?: () => void;
  /** Figma `cart`. Shows the cart button. @default true */
  cart?: boolean;
  /** Item count on the cart badge. Hidden when 0 or not set. Figma sample: 3. */
  cartCount?: number;
  /** Called when the cart button is pressed. */
  onCartClick?: () => void;
}

/** Illustrative status bar from Figma ("Statusbar", filled). Values are fixed samples. */
function StatusBar() {
  return (
    <div className="dp-header__status" aria-hidden="true">
      <span className="dp-header__status-time">5:13</span>
      <span className="dp-header__status-icons">
        <img src={new URL('./assets/mobile-signal.svg', import.meta.url).href} alt="" width="17.3077" height="11.5385" />
        <img src={new URL('./assets/wifi.svg', import.meta.url).href} alt="" width="16.3457" height="11.3789" />
        <span className="dp-header__battery">
          <img src={new URL('./assets/battery.svg', import.meta.url).href} alt="" width="22.6038" height="13" />
          <img className="dp-header__battery-end" src={new URL('./assets/battery-end.svg', import.meta.url).href} alt="" width="0.801423" height="4.05802" />
          <span className="dp-header__battery-level">76</span>
        </span>
      </span>
    </div>
  );
}

export function Header({
  statusBar = false,
  locationLabel,
  locationAddress,
  onLocationClick,
  profile = true,
  onProfileClick,
  cart = true,
  cartCount,
  onCartClick,
  className,
  ...rest
}: HeaderProps) {
  const showBadge = cartCount !== undefined && cartCount > 0;

  return (
    <header {...rest} className={['dp-header', className].filter(Boolean).join(' ')}>
      {statusBar && <StatusBar />}

      <div className="dp-header__bar">
        <button type="button" className="dp-header__location" onClick={onLocationClick}>
          <span className="dp-header__icon dp-header__icon--location" aria-hidden="true" />
          <span className="dp-header__location-text">
            <span className="dp-header__location-label">{locationLabel}</span>
            {locationAddress != null && <span className="dp-header__location-address">{locationAddress}</span>}
          </span>
          <span className="dp-header__icon dp-header__icon--chevron" aria-hidden="true" />
        </button>

        {profile && (
          <button type="button" className="dp-header__circle dp-header__circle--profile" onClick={onProfileClick} aria-label="Profile">
            <span className="dp-header__icon dp-header__icon--person" aria-hidden="true" />
          </button>
        )}

        {cart && (
          <button
            type="button"
            className="dp-header__circle dp-header__circle--cart"
            onClick={onCartClick}
            aria-label={showBadge ? `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Cart'}
          >
            <span className="dp-header__icon dp-header__icon--bag" aria-hidden="true" />
            {showBadge && <CounterBadge className="dp-header__cart-badge" count={cartCount} aria-hidden="true" />}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
