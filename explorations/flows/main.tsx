import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@ds/tokens/fonts.css';
import '@ds/tokens/tokens.css';
import { SignInFlow, type SignInFlowProps } from './src/SignIn/SignInFlow';
import { ShopFlow, type ShopFlowProps } from './src/Shop/ShopFlow';
import { EmailLoginFlow, type EmailLoginFlowProps } from './src/EmailLogin/EmailLoginFlow';
import { Button } from '@ds/components/Button';
import './showcase.css';
import './mobile-type.css';

const cart = { vitc: 1, paracetamol: 2, azithro: 1 };
type Screen = { title: string; note: string } & ({ signin: SignInFlowProps } | { shop: ShopFlowProps } | { login: EmailLoginFlowProps });
const groups: { name: string; screens: Screen[] }[] = [
  {
    name: 'Email login (Ocula-inspired)',
    screens: [
      { title: 'Splash', note: 'Logo inverse, expanding rings', login: { still: true } },
      { title: 'Onboarding 1', note: 'Hooman on patterned panel, round next button', login: { initialStep: 'onboarding' } },
      { title: 'Onboarding 3', note: 'Last slide swaps to Get started', login: { initialStep: 'onboarding', initialSlide: 2 } },
      { title: 'Log in', note: 'InputField, show/hide password, OTP fallback', login: { initialStep: 'login' } },
      { title: 'Log in error', note: 'Inline alert with shake', login: { initialStep: 'login', initialEmail: 'ananya@example.com', initialPassword: 'wrongpass', initialError: true } },
      { title: 'Sign up', note: 'Password strength, Checkbox terms', login: { initialStep: 'signup', initialEmail: 'ananya@example.com', initialPassword: 'Health@2026' } },
      { title: 'Reset password', note: 'Forgot-password entry', login: { initialStep: 'forgot' } },
      { title: 'Link sent', note: 'Hooman delivery-with-box', login: { initialStep: 'sent', initialEmail: 'ananya@example.com' } },
      { title: 'Loading', note: 'Hands off to the shop home', login: { initialStep: 'loading', still: true } },
    ],
  },
  {
    name: 'Mobile OTP sign in',
    screens: [
      { title: 'Sign in', note: 'Phone-first entry, WhatsApp opt-in, email fallback', signin: {} },
      { title: 'Invalid number', note: 'InputField status="error"', signin: { initialPhone: '12345', initialPhoneError: true } },
      { title: 'Email', note: 'Passwordless email path', signin: { initialStep: 'email', initialEmail: 'ananya@example.com' } },
      { title: 'Verify OTP', note: 'OtpField 4-digit, resend countdown', signin: { initialStep: 'otp', initialPhone: '9876543210' } },
      { title: 'Wrong code', note: 'OtpField status="error"', signin: { initialStep: 'otp', initialPhone: '9876543210', initialCode: '4821', initialOtpError: true } },
      { title: 'Signed in', note: 'Hooman delivery-thumbs-up', signin: { initialStep: 'success' } },
    ],
  },
  {
    name: 'Home',
    screens: [
      { title: 'Home', note: 'Header, Search, Grid, CompoundButton, Banner, InfoBanner, Widget + SkuCard', shop: { initialRoute: 'home' } },
      { title: 'Home with cart', note: 'SkuCard added state, cart badge, view-cart bar', shop: { initialRoute: 'home', initialCart: { vitc: 1, ors: 2 } } },
    ],
  },
  {
    name: 'Product page',
    screens: [
      { title: 'Product page', note: 'Tag, Rating, Badge, SpecialButton, InfoBanner, Accordion', shop: { initialRoute: 'product', initialProduct: 'vitc' } },
      { title: 'Rx product, in cart', note: 'Prescription notice, QuantityDropdown + Go to cart', shop: { initialRoute: 'product', initialProduct: 'azithro', initialCart: { azithro: 1 } } },
    ],
  },
  {
    name: 'Cart and checkout',
    screens: [
      { title: 'Cart', note: 'Prescription needed blocks checkout', shop: { initialRoute: 'cart', initialCart: cart } },
      { title: 'Apply coupon', note: 'BottomSheet + Radio', shop: { initialRoute: 'cart', initialCart: cart, initialCouponSheet: true } },
      { title: 'Ready to pay', note: 'Coupon applied, prescription uploaded', shop: { initialRoute: 'cart', initialCart: cart, initialCoupon: 'FIRST20', initialRxUploaded: true } },
      { title: 'Empty cart', note: 'Hooman delivery-confused', shop: { initialRoute: 'cart' } },
      { title: 'Order placed', note: 'Hooman delivery-bike', shop: { initialRoute: 'placed' } },
    ],
  },
];

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="sc-phone">
      <div className="sc-phone__status" aria-hidden>
        <span>9:41</span>
        <span className="sc-phone__notch" />
        <span>●●● ▮</span>
      </div>
      <div className="sc-phone__screen">{children}</div>
    </div>
  );
}

function LoginJourney() {
  const [stage, setStage] = useState<'login' | 'phone' | 'shop'>('login');
  if (stage === 'shop') return <ShopFlow initialRoute="home" />;
  if (stage === 'phone') return <ShopFlow initialRoute="signin" />;
  return <EmailLoginFlow onDone={() => setStage('shop')} onUsePhone={() => setStage('phone')} />;
}

function App() {
  const [view, setView] = useState<'login' | 'prototype' | 'screens'>('login');
  const [run, setRun] = useState(0);
  return (
    <div className="sc">
      <header className="sc__head">
        <div>
          <p className="sc__eyebrow text-label-sm-semibold">Dopamine design system · <a href="../">Storybook</a></p>
          <h1 className="text-h2-bold">Login and shopping journey</h1>
          <p className="text-body-base-regular sc__sub">
            Two ways in (email login and mobile OTP), then home → product page → cart → order placed, built only from Dopamine components and tokens. Products and prices are sample data.
          </p>
        </div>
        <div className="sc__tabs" role="tablist">
          <button role="tab" aria-selected={view === 'login'} onClick={() => setView('login')}>Email login</button>
          <button role="tab" aria-selected={view === 'prototype'} onClick={() => setView('prototype')}>OTP + shopping</button>
          <button role="tab" aria-selected={view === 'screens'} onClick={() => setView('screens')}>All screens</button>
        </div>
      </header>

      {view === 'login' ? (
        <div className="sc__proto">
          <Phone>
            <LoginJourney key={run} />
          </Phone>
          <aside className="sc__guide">
            <h2 className="text-h5-bold">Email login, inspired by Ocula</h2>
            <p className="text-body-sm-regular sc__sub">
              Splash with expanding rings, an illustrated onboarding carousel with a round next button, and a bold “Log in.” screen with
              the illustration up top, the same rhythm as the Ocula shot, in Dopamine’s coral and Hoomans.
            </p>
            <h2 className="text-h5-bold">Try it</h2>
            <ol className="text-body-sm-regular">
              <li>Watch the splash, then swipe or tap the arrow through onboarding.</li>
              <li>Log in with any email and password. Use the password <b>wrong123</b> to see the error state.</li>
              <li>Try <b>Forgot your password?</b> and <b>Sign up</b> (watch the strength meter).</li>
              <li>After login you land on the shop home. <b>Log in with mobile OTP</b> opens the OTP flow.</li>
            </ol>
            <Button variant="outline" size="sm" leftIcon={false} rightIcon={false} onClick={() => setRun((r) => r + 1)}>
              Restart from splash
            </Button>
          </aside>
        </div>
      ) : view === 'prototype' ? (
        <div className="sc__proto">
          <Phone>
            <ShopFlow key={run} />
          </Phone>
          <aside className="sc__guide">
            <h2 className="text-h5-bold">Try it</h2>
            <ol className="text-body-sm-regular">
              <li>Sign in with any 10-digit number starting 6–9 and OTP <b>1234</b> (or tap <b>Skip</b>).</li>
              <li>On home, add a bestseller, search “vitamin”, or tap a card to open its product page.</li>
              <li>On the product page, add to cart, change quantity, then <b>Go to cart</b>.</li>
              <li>Add the Azithromycin (Rx) from <b>Health essentials</b> to see the prescription step.</li>
              <li>In the cart, apply <b>FIRST20</b>, toggle coins and place the order.</li>
            </ol>
            <h2 className="text-h5-bold">Components used</h2>
            <ul className="sc__chips text-caption-base-medium">
              {['Logo', 'Hooman', 'InputField', 'Checkbox', 'Button', 'Divider', 'OtpField', 'Toast', 'Icon', 'Header', 'Search', 'Grid', 'CompoundButton', 'Banner', 'InfoBanner', 'Widget', 'SkuCard', 'Tag', 'Rating', 'Badge', 'SpecialButton', 'Accordion', 'QuantityDropdown', 'CounterBadge', 'ListItem', 'Illustration', 'Toggle', 'Radio', 'BottomSheet', 'Footer'].map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </aside>
        </div>
      ) : (
        <div className="sc__groups">
          {(() => {
            let n = 0;
            return groups.map((g) => (
              <section key={g.name} className="sc__group">
                <h2 className="text-h4-bold">{g.name}</h2>
                <div className="sc__grid">
                  {g.screens.map((s) => (
                    <figure key={s.title} className="sc__frame">
                      <Phone>{'signin' in s ? <SignInFlow {...s.signin} /> : 'login' in s ? <EmailLoginFlow {...s.login} /> : <ShopFlow {...s.shop} />}</Phone>
                      <figcaption>
                        <span className="text-label-base-bold">{String(++n).padStart(2, '0')} · {s.title}</span>
                        <span className="text-caption-base-regular sc__sub">{s.note}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ));
          })()}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
