import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '@ds/components/Button';
import { Checkbox } from '@ds/components/Checkbox';
import { Divider } from '@ds/components/Divider';
import { Hooman } from '@ds/components/Hooman';
import { Icon } from '@ds/components/Icon';
import { InputField } from '@ds/components/InputField';
import { Logo } from '@ds/components/Logo';
import { OtpField } from '@ds/components/OtpField';
import { Toast } from '@ds/components/Toast';
import './SignInFlow.css';

export type SignInStep = 'phone' | 'email' | 'otp' | 'success';
type Channel = 'phone' | 'email';

export interface SignInFlowProps {
  /** Screen to open on. @default 'phone' */
  initialStep?: SignInStep;
  /** Channel used for the OTP screen when it is the initial step. @default 'phone' */
  initialChannel?: Channel;
  /** Prefill values (used by the static screen gallery). */
  initialPhone?: string;
  initialEmail?: string;
  initialCode?: string;
  /** Show the OTP screen in its error state (screen gallery). */
  initialOtpError?: boolean;
  /** Show the phone screen in its error state (screen gallery). */
  initialPhoneError?: boolean;
  /** Demo code that verifies successfully. 4 digits for phone, 6 for email (repeated). @default '1234' */
  demoCode?: string;
  /** Called when the user finishes. */
  onDone?: () => void;
}

const RESEND_SECONDS = 30;
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formatPhone = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

export function SignInFlow({
  initialStep = 'phone',
  initialChannel = 'phone',
  initialPhone = '',
  initialEmail = '',
  initialCode = '',
  initialOtpError = false,
  initialPhoneError = false,
  demoCode = '1234',
  onDone,
}: SignInFlowProps) {
  const [step, setStep] = useState<SignInStep>(initialStep);
  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [phone, setPhone] = useState(initialPhone);
  const [phoneError, setPhoneError] = useState<string | null>(initialPhoneError ? 'Enter a valid 10-digit mobile number' : null);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [code, setCode] = useState(initialCode);
  const [otpStatus, setOtpStatus] = useState<'default' | 'error' | 'success'>(initialOtpError ? 'error' : 'default');
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const otpRef = useRef<HTMLDivElement>(null);

  const digits = channel === 'phone' ? 4 : 6;
  const validCode = channel === 'phone' ? demoCode.slice(0, 4) : (demoCode + demoCode).slice(0, 6);

  // Resend countdown on the OTP screen.
  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, seconds]);

  // Auto-hide toast.
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Boxes are disabled while verifying, so focus is lost; on a wrong code put it back on the last box.
  useEffect(() => {
    if (step !== 'otp' || busy || otpStatus !== 'error' || initialOtpError) return;
    const boxes = otpRef.current?.querySelectorAll<HTMLInputElement>('input:not([type=hidden])');
    boxes?.[boxes.length - 1]?.focus();
  }, [step, busy, otpStatus, initialOtpError]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const goToOtp = (c: Channel) => {
    setChannel(c);
    setCode('');
    setOtpStatus('default');
    setSeconds(RESEND_SECONDS);
    setStep('otp');
  };

  const submitPhone = (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    if (!PHONE_RE.test(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number');
      return;
    }
    setBusy(true);
    later(() => {
      setBusy(false);
      goToOtp('phone');
    }, 700);
  };

  const submitEmail = (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError('Enter a valid email address');
      return;
    }
    setBusy(true);
    later(() => {
      setBusy(false);
      goToOtp('email');
    }, 700);
  };

  const verify = (value = code) => {
    if (value.length !== digits || busy) return;
    setBusy(true);
    later(() => {
      setBusy(false);
      if (value === validCode) {
        setOtpStatus('success');
        later(() => setStep('success'), 600);
      } else {
        setOtpStatus('error');
      }
    }, 700);
  };

  // Enter in a field runs the screen's action (forms may not submit inside sandboxed frames).
  const enterRuns = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      fn();
    }
  };

  const resend = () => {
    setCode('');
    setOtpStatus('default');
    setSeconds(RESEND_SECONDS);
    setToast(channel === 'phone' ? 'New OTP sent by SMS' : 'New code sent to your email');
  };

  const restart = () => {
    setStep('phone');
    setPhone('');
    setEmail('');
    setCode('');
    setOtpStatus('default');
    setPhoneError(null);
    setEmailError(null);
  };

  return (
    <div className="dp-signin" data-step={step}>
      {step === 'phone' && (
        <form className="dp-signin__screen" onSubmit={submitPhone} onKeyDown={(e) => enterRuns(e, submitPhone)} noValidate>
          <div className="dp-signin__hero">
            <div className="dp-signin__topbar">
              <Logo colour="black" />
              <Button variant="ghost" size="sm" leftIcon={false} rightIcon={false} onClick={onDone}>
                Skip
              </Button>
            </div>
            <Hooman name="doctor-arms-folded" height={188} className="dp-signin__hooman" />
          </div>

          <div className="dp-signin__body">
            <header className="dp-signin__heading">
              <h1 className="text-h3-bold">Sign in or create an account</h1>
              <p className="text-body-base-regular dp-signin__muted">
                Medicines, lab tests and doctor consults, all in one place.
              </p>
            </header>

            <InputField
              label="Mobile number"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="10-digit number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                setPhoneError(null);
              }}
              onClear={() => setPhone('')}
              status={phoneError ? 'error' : 'default'}
              helperText={phoneError ?? 'We’ll send a 4-digit OTP to this number'}
            />

            <Checkbox defaultChecked circle={false}>
              <span className="text-body-sm-regular">Get order updates on WhatsApp</span>
            </Checkbox>

            <Button type="button" onClick={() => submitPhone()} variant="brand" size="lg" leftIcon={false} rightIcon={!busy} disabled={busy} className="dp-signin__full">
              {busy ? 'Sending OTP…' : 'Get OTP'}
            </Button>

            <OrDivider />

            <Button
              variant="outline"
              size="lg"
              leftIcon={false}
              rightIcon={false}
              className="dp-signin__full"
              onClick={() => setStep('email')}
            >
              Continue with email
            </Button>
          </div>

          <Legal />
        </form>
      )}

      {step === 'email' && (
        <form className="dp-signin__screen" onSubmit={submitEmail} onKeyDown={(e) => enterRuns(e, submitEmail)} noValidate>
          <BackBar onBack={() => setStep('phone')} />
          <div className="dp-signin__body">
            <header className="dp-signin__heading">
              <h1 className="text-h3-bold">Sign in with email</h1>
              <p className="text-body-base-regular dp-signin__muted">We’ll email you a 6-digit code. No password needed.</p>
            </header>

            <InputField
              label="Email address"
              required
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              onClear={() => setEmail('')}
              status={emailError ? 'error' : 'default'}
              helperText={emailError ?? undefined}
            />

            <Button type="button" onClick={() => submitEmail()} variant="brand" size="lg" leftIcon={false} rightIcon={!busy} disabled={busy} className="dp-signin__full">
              {busy ? 'Sending code…' : 'Send code'}
            </Button>

            <Button variant="ghost" size="sm" leftIcon={<Icon name="phone-telephone-regular" size={20} color="currentColor" />} rightIcon={false} onClick={() => setStep('phone')} className="dp-signin__center">
              Use mobile number instead
            </Button>
          </div>
          <div className="dp-signin__spacer" />
          <Legal />
        </form>
      )}

      {step === 'otp' && (
        <form
          className="dp-signin__screen"
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
          noValidate
        >
          <BackBar onBack={() => setStep(channel)} />
          <div className="dp-signin__body">
            <header className="dp-signin__heading">
              <h1 className="text-h3-bold">{channel === 'phone' ? 'Verify your number' : 'Check your email'}</h1>
              <p className="text-body-base-regular dp-signin__muted">
                Enter the {digits}-digit code sent to{' '}
                <strong className="dp-signin__strong">{channel === 'phone' ? formatPhone(phone || '9876543210') : email || 'you@example.com'}</strong>
                <button type="button" className="dp-signin__link text-label-base-semibold" onClick={() => setStep(channel)}>
                  Edit
                </button>
              </p>
            </header>

            <div ref={otpRef}>
            <OtpField
              key={channel}
              digits={digits}
              value={code}
              autoFocus={initialStep !== 'otp'}
              onChange={(v) => {
                setCode(v);
                if (otpStatus === 'error') setOtpStatus('default');
              }}
              onComplete={(v) => verify(v)}
              status={otpStatus}
              disabled={busy || otpStatus === 'success'}
              helperText={
                otpStatus === 'error'
                  ? 'That code didn’t match. Check and try again.'
                  : otpStatus === 'success'
                    ? 'Verified'
                    : undefined
              }
              onResend={seconds <= 0 ? resend : undefined}
            />
            </div>

            {seconds > 0 && (
              <p className="text-caption-base-regular dp-signin__muted" aria-live="polite">
                Resend {channel === 'phone' ? 'OTP' : 'code'} in{' '}
                <span className="dp-signin__strong">0:{String(seconds).padStart(2, '0')}</span>
              </p>
            )}

            <Button
              type="button"
              onClick={() => verify()}
              variant="brand"
              size="lg"
              leftIcon={false}
              rightIcon={false}
              disabled={code.length !== digits || busy || otpStatus === 'success'}
              className="dp-signin__full"
            >
              {busy ? 'Verifying…' : 'Verify & continue'}
            </Button>

            <p className="text-caption-sm-regular dp-signin__hint">Prototype: use code {validCode}</p>
          </div>

          {toast && (
            <div className="dp-signin__toast">
              <Toast type="success" label={toast} onDismiss={() => setToast(null)} />
            </div>
          )}
        </form>
      )}

      {step === 'success' && (
        <div className="dp-signin__screen dp-signin__screen--success">
          <div className="dp-signin__success">
            <Hooman name="delivery-thumbs-up" height={220} />
            <h1 className="text-h2-bold">You’re signed in</h1>
            <p className="text-body-base-regular dp-signin__muted">
              Your prescriptions, orders and lab reports are now synced to your account.
            </p>
          </div>
          <div className="dp-signin__body">
            <Button variant="brand" size="lg" leftIcon={false} rightIcon className="dp-signin__full" onClick={onDone ?? restart}>
              Start shopping
            </Button>
            <Button variant="ghost" size="sm" leftIcon={false} rightIcon={false} className="dp-signin__center" onClick={restart}>
              Restart prototype
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="dp-signin__backbar">
      <button type="button" className="dp-signin__back" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left-regular" size={24} />
      </button>
      <Logo colour="black" className="dp-signin__backlogo" />
    </div>
  );
}

function OrDivider(): ReactNode {
  return (
    <div className="dp-signin__or" role="separator" aria-label="or">
      <Divider />
      <span className="text-caption-base-medium">or</span>
      <Divider />
    </div>
  );
}

function Legal() {
  return (
    <p className="dp-signin__legal text-caption-sm-regular">
      By continuing, you agree to our <a href="#terms">Terms of use</a> and <a href="#privacy">Privacy policy</a>.
    </p>
  );
}

export default SignInFlow;
