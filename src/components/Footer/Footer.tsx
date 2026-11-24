import type { ComponentPropsWithRef } from 'react';
import { Logo } from '../Logo';
import './Footer.css';

export type FooterProps = Omit<ComponentPropsWithRef<'footer'>, 'children'>;

/**
 * Brand sign-off footer (Figma “Footer”): TATA 1mg logo + “Adding some sunshine to your life”.
 * Static by design: Figma asks to keep the logo, wording and gradient intact, so there are no content props.
 */
export function Footer({ className, ...rest }: FooterProps) {
  return (
    <footer {...rest} className={['dp-footer', className].filter(Boolean).join(' ')}>
      <Logo colour="black" />
      <p className="dp-footer__message">Adding some sunshine to your life</p>
    </footer>
  );
}

export default Footer;
