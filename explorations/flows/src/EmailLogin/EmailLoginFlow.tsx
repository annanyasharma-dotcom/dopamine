import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '@ds/components/Button';
import { Checkbox } from '@ds/components/Checkbox';
import { Divider } from '@ds/components/Divider';
import { Hooman, type HoomanName } from '@ds/components/Hooman';
import { Icon } from '@ds/components/Icon';
import { InputField } from '@ds/components/InputField';
import { Logo } from '@ds/components/Logo';
import { Toast } from '@ds/components/Toast';
import './EmailLoginFlow.css';

/**
 * Login flow inspired by the "Ocula" login interaction:
 * splash → illustrated onboarding carousel → log in / sign up → forgot password → loading.
 * Built from Dopamine components and tokens.
 */

export type EmailLoginStep = 'splash' | 'onboarding' | 'login' | 'signup' | 'forgot' | 'sent' | 'loading';

export interface EmailLoginFlowProps {
  /** Screen to open on. @default 'splash' */
  initialStep?: EmailLoginStep;
  /** Onboarding slide to open on (0–2). */
  initialSlide?: number;
  /** Prefill (screen gallery). */
  initialEmail?: string;
  initialPassword?: string;
  /** Show the login error state (screen gallery). */
  initialError?: boolean;
  /** Freeze the splash and loading screens instead of moving on (screen gallery). */
  still?: boolean;
  /** Called once the user is signed in. */
  onDone?: () => void;
  /** Called when the user picks "Log in with mobile OTP". */
  onUsePhone?: () => void;
}

/** Prototype: any valid email and password logs in, except this password, which shows the error state. */
const DEMO_WRONG_PASSWORD = 'wrong123';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const slides: { hooman: HoomanName; height?: number; title: string; body: string }[] = [
  {
    hooman: 'delivery-bike',
    title: 'Medicines at your door in 30 minutes.',
    body: 'Order from 1 lakh+ medicines and health products, delivered fast from a pharmacy near you.',
  },
  {
    hooman: 'doctor-with-stethoscope',
    title: 'Talk to a doctor, anytime.',
    body: 'Consult verified doctors on chat or call and get a prescription in minutes.',
  },
  {
    hooman: 'phlebotomist-home-visit',
    height: 170,
    title: 'Lab tests, collected at home.',
    body: 'Book a test, we send a certified collector, and your reports arrive in the app.',
  },
];

function strength(pw: string): { label: string; level: 0 | 1 | 2 | 3 } {
  if (!pw) return { label: '', level: 0 };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length < 8) return { label: 'Too short, use at least 8 characters', level: 1 };
  return s >= 3 ? { label: 'Strong password', level: 3 } : s === 2 ? { label: 'Good, add a symbol and a number to make it strong', level: 2 } : { label: 'Weak, mix upper and lower case, numbers and symbols', level: 1 };
}

export function EmailLoginFlow({
  initialStep = 'splash',
  initialSlide = 0,
  initialEmail = '',
  initialPassword = '',
  initialError = false,
  still = false,
  onDone,
  onUsePhone,
}: EmailLoginFlowProps) {
  const [step, setStep] = useState<EmailLoginStep>(initialStep);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [slide, setSlide] = useState(initialSlide);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>(
    initialError ? { form: 'That email and password don’t match. Try again or reset your password.' } : {},
  );
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = (s: EmailLoginStep, d: 'fwd' | 'back' = 'fwd') => {
    setDir(d);
    setErrors({});
    setShowPw(false);
    setStep(s);
  };

  // Splash and loading move on by themselves.
  useEffect(() => {
    if (still) return;
    if (step === 'splash') later(() => go('onboarding'), 1900);
    if (step === 'loading') later(() => onDone?.(), 1800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, still]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Keep the carousel scroll position and the dots in sync.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: slide * el.clientWidth, behavior: step === 'onboarding' && !still ? 'smooth' : 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, step]);

  // Update the active slide only once a swipe settles, so programmatic smooth scrolls aren't fought.
  const settle = useRef<number | undefined>(undefined);
  const onRailScroll = () => {
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = railRef.current;
      if (!el) return;
      setSlide(Math.round(el.scrollLeft / el.clientWidth));
    }, 120);
  };

  const submitLogin = (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Enter your password';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    later(() => {
      setBusy(false);
      if (password !== DEMO_WRONG_PASSWORD) go('loading');
      else setErrors({ form: 'That email and password don’t match. Try again or reset your password.' });
    }, 800);
  };

  const submitSignup = (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Enter your name';
    if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address';
    if (password.length < 8) errs.password = 'Use at least 8 characters';
    if (!agree) errs.agree = 'Accept the terms to continue';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    later(() => {
      setBusy(false);
      go('loading');
    }, 900);
  };

  const submitForgot = (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setErrors({ email: 'Enter the email you signed up with' });
      return;
    }
    setBusy(true);
    later(() => {
      setBusy(false);
      go('sent');
    }, 800);
  };

  const enterRuns = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      fn();
    }
  };

  const clearErr = (k: string) => setErrors(({ [k]: _drop, form: _f, ...rest }) => rest);
  const pw = strength(password);

  const passwordField = (autoComplete: string, helper?: ReactNode) => (
    <div className="dp-elogin__pw">
      <InputField
        label="Password"
        required
        type={showPw ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={autoComplete === 'new-password' ? 'At least 8 characters' : 'Your password'}
        value={password}
        clearable={false}
        onChange={(e) => {
          setPassword(e.target.value);
          clearErr('password');
        }}
        status={errors.password || errors.form ? 'error' : 'default'}
        helperText={errors.password ?? helper}
      />
      <button
        type="button"
        className="dp-elogin__show text-label-sm-bold"
        onClick={() => setShowPw((v) => !v)}
        aria-pressed={showPw}
        aria-label={showPw ? 'Hide password' : 'Show password'}
      >
        {showPw ? 'Hide' : 'Show'}
      </button>
    </div>
  );

  let screen: ReactNode = null;

  if (step === 'splash' || step === 'loading') {
    screen = (
      <div className={`dp-elogin__splash${step === 'loading' ? ' is-loading' : ''}${still ? ' is-still' : ''}`} role="status" aria-live="polite">
        <div className="dp-elogin__ring" aria-hidden="true">
          <span />
          <span />
        </div>
        {step === 'splash' ? (
          <Logo colour="black" className="dp-elogin__splash-logo" />
        ) : (
          <p className="text-label-lg-bold dp-elogin__splash-text">Setting up your account…</p>
        )}
      </div>
    );
  }

  if (step === 'onboarding') {
    const last = slide === slides.length - 1;
    screen = (
      <div className="dp-elogin__screen dp-elogin__onboard">
        <div className="dp-elogin__bar">
          <Logo colour="black" />
          <Button variant="ghost" size="sm" leftIcon={false} rightIcon={false} onClick={() => go('login')}>
            Skip
          </Button>
        </div>
        <div className="dp-elogin__rail" ref={railRef} onScroll={onRailScroll} aria-roledescription="carousel">
          {slides.map((s, i) => (
            <section
              key={s.title}
              className={`dp-elogin__slide${i === slide ? ' is-on' : ''}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== slide}
            >
              <div className={`dp-elogin__art dp-elogin__art--${i}`}>
                <span className="dp-elogin__shape dp-elogin__shape--a" />
                <span className="dp-elogin__shape dp-elogin__shape--b" />
                <span className="dp-elogin__shape dp-elogin__shape--c" />
                <Hooman name={s.hooman} height={s.height ?? 230} className="dp-elogin__art-hooman" />
              </div>
              <h1 className="text-h1-bold dp-elogin__display">{s.title}</h1>
              <p className="text-body-base-regular dp-elogin__muted">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="dp-elogin__onboard-foot">
          <div className="dp-elogin__dots" role="tablist" aria-label="Slides">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={`Slide ${i + 1}`}
                className={i === slide ? 'is-on' : ''}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          {last ? (
            <Button variant="brand" size="lg" leftIcon={false} rightIcon onClick={() => go('login')}>
              Get started
            </Button>
          ) : (
            <button type="button" className="dp-elogin__next" onClick={() => setSlide(slide + 1)} aria-label="Next slide">
              <Icon name="arrow-right-bold" size={24} color="var(--icon-brand-primary-inverse)" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'login' || step === 'signup') {
    const isLogin = step === 'login';
    screen = (
      <form className="dp-elogin__screen" onSubmit={isLogin ? submitLogin : submitSignup} onKeyDown={(e) => enterRuns(e, () => (isLogin ? submitLogin() : submitSignup()))} noValidate>
        <TopBar onBack={() => go('onboarding', 'back')} />
        <div className="dp-elogin__hero">
          <h1 className="text-h1-bold dp-elogin__display">
            {isLogin ? 'Log in.' : 'Sign up.'}
            <span className="dp-elogin__tick" aria-hidden="true">
              <Icon name="check-bold" size={20} color="var(--icon-brand-primary-inverse)" />
            </span>
          </h1>
          <Hooman name={isLogin ? 'pharmacist-standing-with-medicine' : 'doctor-arms-folded'} height={150} className="dp-elogin__hero-hooman" />
        </div>

        <div className="dp-elogin__body">
          {errors.form && (
            <div className="dp-elogin__alert text-body-sm-semibold" role="alert">
              {errors.form}
            </div>
          )}
          {!isLogin && (
            <InputField
              label="Full name"
              required
              autoComplete="name"
              placeholder="As on your ID"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearErr('name');
              }}
              onClear={() => setName('')}
              status={errors.name ? 'error' : 'default'}
              helperText={errors.name}
            />
          )}
          <InputField
            label="Email"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErr('email');
            }}
            onClear={() => setEmail('')}
            status={errors.email || (isLogin && errors.form) ? 'error' : 'default'}
            helperText={errors.email}
          />
          {isLogin
            ? passwordField('current-password')
            : passwordField(
                'new-password',
                pw.level ? (
                  <span className={`dp-elogin__strength is-${pw.level}`}>
                    <span className="dp-elogin__meter" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    {pw.label}
                  </span>
                ) : undefined,
              )}

          {isLogin ? (
            <button type="button" className="dp-elogin__link dp-elogin__forgot text-label-sm-semibold" onClick={() => go('forgot')}>
              Forgot your password?
            </button>
          ) : (
            <Checkbox
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                clearErr('agree');
              }}
            >
              <span className={`text-body-sm-regular${errors.agree ? ' dp-elogin__err' : ''}`}>
                I agree to the <a href="#terms">Terms of use</a> and <a href="#privacy">Privacy policy</a>
              </span>
            </Checkbox>
          )}

          <Button type="button" onClick={() => (isLogin ? submitLogin() : submitSignup())} variant="brand" size="lg" leftIcon={false} rightIcon={!busy} disabled={busy} className="dp-elogin__full">
            {busy ? (isLogin ? 'Logging in…' : 'Creating account…') : isLogin ? 'Log in' : 'Create account'}
          </Button>

          {isLogin && (
            <>
              <div className="dp-elogin__or" role="separator" aria-label="or">
                <Divider />
                <span className="text-caption-base-medium">or</span>
                <Divider />
              </div>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Icon name="phone-telephone-regular" size={24} color="currentColor" />}
                rightIcon={false}
                className="dp-elogin__full"
                onClick={() => (onUsePhone ? onUsePhone() : setToast('Mobile OTP login opens here'))}
              >
                Log in with mobile OTP
              </Button>
              <p className="dp-elogin__hint text-caption-sm-regular">
                Prototype: any email and password works · use {DEMO_WRONG_PASSWORD} to see the error
              </p>
            </>
          )}
        </div>

        <p className="dp-elogin__switch text-body-sm-regular">
          {isLogin ? 'New to TATA 1mg?' : 'Already have an account?'}{' '}
          <button type="button" className="dp-elogin__link text-label-base-bold" onClick={() => go(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    );
  }

  if (step === 'forgot') {
    screen = (
      <form className="dp-elogin__screen" onSubmit={submitForgot} onKeyDown={(e) => enterRuns(e, () => submitForgot())} noValidate>
        <TopBar onBack={() => go('login', 'back')} />
        <div className="dp-elogin__hero">
          <h1 className="text-h1-bold dp-elogin__display">Reset password.</h1>
          <Hooman name="pharmacist-verifying-prescription" height={150} className="dp-elogin__hero-hooman" />
        </div>
        <div className="dp-elogin__body">
          <p className="text-body-base-regular dp-elogin__muted">Enter the email you signed up with. We’ll send you a link to set a new password.</p>
          <InputField
            label="Email"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErr('email');
            }}
            onClear={() => setEmail('')}
            status={errors.email ? 'error' : 'default'}
            helperText={errors.email}
          />
          <Button type="button" onClick={() => submitForgot()} variant="brand" size="lg" leftIcon={false} rightIcon={!busy} disabled={busy} className="dp-elogin__full">
            {busy ? 'Sending link…' : 'Send reset link'}
          </Button>
        </div>
      </form>
    );
  }

  if (step === 'sent') {
    screen = (
      <div className="dp-elogin__screen">
        <TopBar onBack={() => go('forgot', 'back')} />
        <div className="dp-elogin__sent">
          <Hooman name="delivery-with-box" height={210} />
          <h1 className="text-h1-bold dp-elogin__display">Check your inbox.</h1>
          <p className="text-body-base-regular dp-elogin__muted">
            We sent a reset link to <strong className="dp-elogin__strong">{email || 'you@example.com'}</strong>. It expires in 15 minutes.
          </p>
        </div>
        <div className="dp-elogin__body">
          <Button variant="brand" size="lg" leftIcon={false} rightIcon={false} className="dp-elogin__full" onClick={() => go('login', 'back')}>
            Back to log in
          </Button>
          <Button variant="ghost" size="sm" leftIcon={false} rightIcon={false} className="dp-elogin__center" onClick={() => setToast('Reset link sent again')}>
            Didn’t get it? Resend
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-elogin" data-step={step}>
      <div key={step} className={`dp-elogin__stage dp-elogin__stage--${dir}`}>
        {screen}
      </div>
      {toast && (
        <div className="dp-elogin__toast">
          <Toast type="success" label={toast} onDismiss={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="dp-elogin__bar">
      <button type="button" className="dp-elogin__back" onClick={onBack} aria-label="Back">
        <Icon name="chevron-left-regular" size={24} />
      </button>
      <Logo colour="black" />
    </div>
  );
}

export default EmailLoginFlow;
