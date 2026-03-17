import React, { useMemo, useState } from 'react';
import { LockKeyhole, User, ShieldCheck, Sparkles } from 'lucide-react';
import GradientText from './GradientText';
import Grainient from './Grainient';

interface LoginPortalProps {
  adminOnly?: boolean;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string; message?: string; requiresOtp?: boolean; email?: string }>;
  onSignup: (email: string, password: string, displayName: string) => Promise<{ ok: boolean; error?: string; message?: string; requiresOtp?: boolean; email?: string }>;
  onVerifyOtp: (email: string, token: string) => Promise<{ ok: boolean; error?: string; message?: string }>;
  onResendOtp: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>;
}

const LoginPortal: React.FC<LoginPortalProps> = ({ adminOnly = false, onLogin, onSignup, onVerifyOtp, onResendOtp }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const canSubmitLogin = useMemo(
    () => email.trim().length > 4 && password.length > 5,
    [email, password]
  );
  const canSubmitSignup = useMemo(
    () => displayName.trim().length > 1 && email.trim().length > 4 && password.length > 5 && confirmPassword.length > 5,
    [displayName, email, password, confirmPassword]
  );

  const switchMode = (nextMode: 'login' | 'signup') => {
    if (adminOnly) return;
    setMode(nextMode);
    setError('');
    setSuccess('');
    setDisplayName('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (targetMode: 'login' | 'signup', event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (targetMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    setIsSubmitting(true);
    let result;
    try {
      result =
        targetMode === 'login'
          ? await onLogin(normalizedEmail, password)
          : await onSignup(normalizedEmail, password, displayName.trim());
    } finally {
      setIsSubmitting(false);
    }

    if (!result.ok) {
      setError(
        result.error || (targetMode === 'login' ? 'Unable to sign in.' : 'Unable to create account.')
      );
      setSuccess('');
      return;
    }
    setError('');
    setSuccess(result.message || '');
    if (result.requiresOtp && result.email) {
      setOtpEmail(result.email);
      setOtpCode('');
      const otpMessage = result.message || `A code has been sent to ${result.email}.`;
      const hasSendIssue = otpMessage.toLowerCase().includes('failed');
      setOtpError(hasSendIssue ? otpMessage : '');
      setOtpSuccess(hasSendIssue ? '' : otpMessage);
      setOtpOpen(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setOtpError('Enter the code sent to your email.');
      return;
    }
    setOtpLoading(true);
    let result;
    try {
      result = await onVerifyOtp(otpEmail, otpCode.trim());
    } finally {
      setOtpLoading(false);
    }
    if (!result.ok) {
      setOtpError(result.error || 'Invalid code.');
      return;
    }
    setOtpError('');
    setOtpSuccess(result.message || 'Email verified successfully.');
    setOtpOpen(false);
  };

  const handleResendOtp = async () => {
    if (!otpEmail) return;
    setOtpLoading(true);
    let result;
    try {
      result = await onResendOtp(otpEmail);
    } finally {
      setOtpLoading(false);
    }
    if (!result.ok) {
      setOtpError(result.error || 'Unable to resend code.');
      return;
    }
    setOtpError('');
    setOtpSuccess(result.message || `A new code was sent to ${otpEmail}.`);
  };

  return (
    <section className="relative min-h-[calc(100vh-120px)] overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <Grainient
          color1="#D7FF5B"
          color2="#0A7A58"
          color3="#10261c"
          timeSpeed={0.28}
          warpStrength={1.15}
          warpFrequency={5.2}
          warpSpeed={2.1}
          warpAmplitude={52}
          blendSoftness={0.06}
          rotationAmount={320}
          noiseScale={1.8}
          grainAmount={0.12}
          grainScale={2}
          grainAnimated={false}
          contrast={1.35}
          gamma={1}
          saturation={1.08}
          zoom={0.92}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_88%_6%,rgba(255,179,71,0.10),transparent_38%),linear-gradient(to_bottom,rgba(249,247,247,0.22),rgba(249,247,247,0.36))]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full border border-white/35"></div>
      <div className="pointer-events-none absolute -right-20 bottom-8 h-64 w-64 rounded-full border border-white/28"></div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-7 lg:grid-cols-12">
        <article className="login-motion p-2 md:p-4 lg:col-span-7">
          <p className="login-item text-xs font-bold uppercase tracking-[0.24em] text-lifewood-darkSerpent">Secure Access</p>
          <h1 className="login-item mt-3 text-[2.5rem] font-black leading-[0.96] text-lifewood-darkSerpent md:text-[4rem]">
            <GradientText
              colors={['#133020', '#046241', '#0d8e5f', '#C8FF34']}
              animationSpeed={7}
              direction="horizontal"
              pauseOnHover
            >
              {adminOnly ? (
                <>
                  Lifewood Admin
                  <br />
                  Access Portal
                </>
              ) : (
                <>
                  Lifewood Internal
                  <br />
                  Identity Gateway
                </>
              )}
            </GradientText>
          </h1>
          <p className="login-item mt-4 max-w-xl text-base leading-relaxed text-lifewood-darkSerpent/75 md:text-[1.12rem]">
            {adminOnly
              ? 'Restricted administrative sign-in for authorized Lifewood operators. Access is intentionally hidden from the public website flow.'
              : 'Enterprise-ready sign-in experience designed for internal tools and role-based workspace access.'}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="login-item rounded-2xl border border-lifewood-castleton/18 bg-lifewood-seasalt/85 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-lifewood-darkSerpent/60">Security Layer</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-lifewood-darkSerpent">
                <ShieldCheck className="h-4 w-4" /> Session Protected
              </p>
            </div>
            <div className="login-item rounded-2xl border border-lifewood-castleton/18 bg-lifewood-seasalt/85 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-lifewood-darkSerpent/60">Experience</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-lifewood-darkSerpent">
                <Sparkles className="h-4 w-4" /> Motion Enhanced
              </p>
            </div>
          </div>
        </article>

        <div className="login-motion lg:col-span-5" style={{ animationDelay: '120ms' }}>
          <div className={`authc-container ${mode === 'signup' ? 'right-panel-active' : ''} ${adminOnly ? 'authc-container--admin' : ''}`}>
            {!adminOnly && <div className="authc-form-container authc-sign-up-container">
              <form onSubmit={(event) => handleSubmit('signup', event)} className="authc-form">
                <h2 className="authc-title">Create Account</h2>
                <p className="authc-subtitle">Use your email to register and continue.</p>
                <label className="authc-input-wrap">
                  <User className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Email"
                    autoComplete="email"
                  />
                </label>
                <label className="authc-input-wrap">
                  <User className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Display Name"
                    autoComplete="name"
                  />
                </label>
                <label className="authc-input-wrap">
                  <LockKeyhole className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                </label>
                <label className="authc-input-wrap">
                  <LockKeyhole className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                  />
                </label>
                {error && <p className="authc-error">{error}</p>}
                {success && <p className="authc-success">{success}</p>}
                <button
                  type="submit"
                  disabled={!canSubmitSignup || isSubmitting}
                  className="authc-submit"
                >
                  {isSubmitting ? 'Please wait...' : 'Create Account'}
                </button>
              </form>
            </div>}

            <div className="authc-form-container authc-sign-in-container">
              <form onSubmit={(event) => handleSubmit('login', event)} className="authc-form">
                <h2 className="authc-title">{adminOnly ? 'Admin Sign In' : 'Sign In'}</h2>
                <p className="authc-subtitle">
                  {adminOnly ? 'Use your administrator credentials to continue.' : 'Use your account credentials to continue.'}
                </p>
                <label className="authc-input-wrap">
                  <User className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Email"
                    autoComplete="email"
                  />
                </label>
                <label className="authc-input-wrap">
                  <LockKeyhole className="h-4 w-4 text-lifewood-castleton" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="lifewood-login-input authc-input"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </label>
                {error && <p className="authc-error">{error}</p>}
                {success && <p className="authc-success">{success}</p>}
                <button
                  type="submit"
                  disabled={!canSubmitLogin || isSubmitting}
                  className="authc-submit"
                >
                  {isSubmitting ? 'Please wait...' : 'Sign In'}
                </button>
              </form>
            </div>

            {!adminOnly && <div className="authc-overlay-container">
              <div className="authc-overlay">
                <div className="authc-overlay-panel authc-overlay-left">
                  <h3>Welcome Back!</h3>
                  <p>To keep connected with us, please login with your account details.</p>
                  <button type="button" className="authc-ghost" onClick={() => switchMode('login')}>
                    Sign In
                  </button>
                </div>
                <div className="authc-overlay-panel authc-overlay-right">
                  <h3>Hello, Friend!</h3>
                  <p>Enter your details and begin your journey with Lifewood.</p>
                  <button type="button" className="authc-ghost" onClick={() => switchMode('signup')}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>

      {otpOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 px-4">
          <article className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 text-lifewood-darkSerpent shadow-2xl">
            <h3 className="text-2xl font-bold">Verify Your Email</h3>
            <p className="mt-2 text-sm text-lifewood-darkSerpent/70">
              A code has been sent to <span className="font-semibold">{otpEmail}</span>.
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-lifewood-darkSerpent/65">
                Verification Code
              </span>
              <input
                type="text"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                placeholder="Enter code"
                className="h-11 w-full rounded-xl border border-lifewood-darkSerpent/18 bg-lifewood-seasalt px-3 text-sm outline-none transition focus:border-lifewood-castleton/65 focus:bg-white"
              />
            </label>

            {otpError && (
              <p className="mt-3 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-500">{otpError}</p>
            )}
            {otpSuccess && (
              <p className="mt-3 rounded-lg border border-lifewood-castleton/35 bg-lifewood-castleton/10 px-3 py-2 text-sm text-lifewood-castleton">{otpSuccess}</p>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-lifewood-castleton px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d8e5f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {otpLoading ? 'Checking...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpLoading}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-lifewood-darkSerpent/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-lifewood-seasalt disabled:cursor-not-allowed disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOtpOpen(false)}
              className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-semibold text-lifewood-darkSerpent/70 transition hover:bg-lifewood-seasalt"
            >
              Close
            </button>
          </article>
        </div>
      )}

      <style>{`
        @keyframes loginFloatUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-motion {
          animation: loginFloatUp 520ms ease both;
        }
        .login-item {
          opacity: 0;
          transform: translateY(8px);
          animation: loginFadeIn 520ms ease forwards;
        }
        .login-item:nth-child(1) { animation-delay: 80ms; }
        .login-item:nth-child(2) { animation-delay: 150ms; }
        .login-item:nth-child(3) { animation-delay: 220ms; }
        .login-item:nth-child(4) { animation-delay: 300ms; }
        @keyframes loginFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .lifewood-login-input:-webkit-autofill,
        .lifewood-login-input:-webkit-autofill:hover,
        .lifewood-login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #133020;
          box-shadow: 0 0 0px 1000px #f9f7f7 inset;
          transition: background-color 9999s ease-out 0s;
        }

        .authc-container {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14), 0 10px 10px rgba(0, 0, 0, 0.09);
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 560px;
        }

        .authc-container--admin {
          min-height: 620px;
        }

        .authc-form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .authc-sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .authc-container--admin .authc-sign-in-container {
          width: 100%;
        }

        .authc-container.right-panel-active .authc-sign-in-container {
          transform: translateX(100%);
        }

        .authc-sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .authc-container.right-panel-active .authc-sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
        }

        .authc-form {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 34px;
          height: 100%;
          text-align: center;
          gap: 10px;
        }

        .authc-container--admin .authc-form {
          padding: 0 44px;
        }

        .authc-title {
          font-size: 2rem;
          font-weight: 800;
          color: #133020;
          line-height: 1;
        }

        .authc-subtitle {
          font-size: 13px;
          color: #466356;
          margin-bottom: 8px;
        }

        .authc-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          border: 1px solid rgba(19, 48, 32, 0.16);
          border-radius: 10px;
          padding: 0 12px;
          background: #f8fbfa;
        }

        .authc-input {
          width: 100%;
          height: 42px;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #133020;
        }

        .authc-submit {
          margin-top: 8px;
          width: 100%;
          border-radius: 999px;
          border: 1px solid #0d8e5f;
          background: linear-gradient(92deg, #046241 0%, #0d8e5f 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 12px 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 120ms ease, filter 220ms ease;
        }

        .authc-submit:hover:not(:disabled) {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }

        .authc-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .authc-overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 20;
        }

        .authc-container.right-panel-active .authc-overlay-container {
          transform: translateX(-100%);
        }

        .authc-overlay {
          background: linear-gradient(130deg, #046241 0%, #0d8e5f 55%, #133020 100%);
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .authc-container.right-panel-active .authc-overlay {
          transform: translateX(50%);
        }

        .authc-overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 38px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transition: transform 0.6s ease-in-out;
        }

        .authc-overlay-panel h3 {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.05;
        }

        .authc-overlay-panel p {
          margin: 16px 0 22px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.86);
        }

        .authc-overlay-left {
          transform: translateX(-20%);
        }

        .authc-container.right-panel-active .authc-overlay-left {
          transform: translateX(0);
        }

        .authc-overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .authc-container.right-panel-active .authc-overlay-right {
          transform: translateX(20%);
        }

        .authc-ghost {
          border-radius: 999px;
          border: 1px solid #ffffff;
          background: transparent;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          padding: 11px 30px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: background 200ms ease, color 200ms ease;
        }

        .authc-ghost:hover {
          background: #ffffff;
          color: #046241;
        }

        .authc-error {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.12);
          padding: 8px 10px;
          font-size: 12px;
          color: rgb(153, 27, 27);
          text-align: left;
        }

        .authc-success {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(13, 142, 95, 0.35);
          background: rgba(13, 142, 95, 0.12);
          padding: 8px 10px;
          font-size: 12px;
          color: #0d8e5f;
          text-align: left;
        }

        @media (max-width: 1024px) {
          .authc-container {
            min-height: 640px;
          }
          .authc-container--admin {
            min-height: 560px;
          }
          .authc-form-container,
          .authc-sign-in-container,
          .authc-sign-up-container {
            position: relative;
            width: 100%;
            transform: none !important;
            opacity: 1 !important;
          }
          .authc-sign-up-container { display: none; }
          .authc-container--admin .authc-sign-in-container { display: block; width: 100%; }
          .authc-container.right-panel-active .authc-sign-in-container { display: none; }
          .authc-container.right-panel-active .authc-sign-up-container { display: block; }
          .authc-overlay-container { display: none; }
          .authc-form { padding: 30px 22px; }
          .authc-title { font-size: 1.7rem; }
        }
      `}</style>
    </section>
  );
};

export default LoginPortal;
