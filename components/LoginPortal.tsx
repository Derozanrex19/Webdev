import React, { useMemo, useState } from 'react';
import { LockKeyhole, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginPortalProps {
  onLogin: (email: string, password: string) => { ok: boolean; error?: string };
}

const LoginPortal: React.FC<LoginPortalProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => username.trim().length > 2 && password.length > 5, [username, password]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = onLogin(username.trim(), password);
    if (!result.ok) {
      setError(result.error || 'Unable to sign in.');
      return;
    }
    setError('');
  };

  return (
    <section className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-lifewood-paper px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(4,98,65,0.14),transparent_42%),radial-gradient(circle_at_88%_6%,rgba(255,179,71,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(19,48,32,0.11),transparent_46%)]"></div>
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full border border-lifewood-castleton/22"></div>
      <div className="pointer-events-none absolute -right-20 bottom-8 h-64 w-64 rounded-full border border-lifewood-saffron/30"></div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-7 lg:grid-cols-12">
        <article className="login-motion rounded-3xl border border-lifewood-darkSerpent/14 bg-white/70 p-7 shadow-[0_18px_44px_rgba(19,48,32,0.16)] backdrop-blur-xl md:p-10 lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lifewood-darkSerpent">Secure Access</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[0.98] text-lifewood-darkSerpent md:text-6xl">
            Lifewood Internal
            <br />
            Identity Gateway
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-lifewood-darkSerpent/75 md:text-lg">
            Enterprise-ready sign-in experience designed for internal tools and role-based workspace access.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-lifewood-castleton/18 bg-lifewood-seasalt/85 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-lifewood-darkSerpent/60">Security Layer</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-lifewood-darkSerpent">
                <ShieldCheck className="h-4 w-4" /> Session Protected
              </p>
            </div>
            <div className="rounded-2xl border border-lifewood-castleton/18 bg-lifewood-seasalt/85 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-lifewood-darkSerpent/60">Experience</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-lifewood-darkSerpent">
                <Sparkles className="h-4 w-4" /> Motion Enhanced
              </p>
            </div>
          </div>
        </article>

        <article className="login-motion rounded-3xl border border-lifewood-darkSerpent/15 bg-white/84 p-7 shadow-[0_18px_44px_rgba(19,48,32,0.16)] backdrop-blur-xl md:p-8 lg:col-span-5" style={{ animationDelay: '120ms' }}>
          <h2 className="text-3xl font-bold text-lifewood-darkSerpent">Sign In</h2>
          <p className="mt-1 text-sm text-lifewood-darkSerpent/65">Use your assigned account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-lifewood-darkSerpent/65">Username</span>
              <span className="flex items-center gap-2 rounded-xl border border-lifewood-darkSerpent/18 bg-lifewood-seasalt px-3 transition focus-within:border-lifewood-castleton/65 focus-within:bg-white">
                <User className="h-4 w-4 text-lifewood-castleton" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="lifewood-login-input h-11 w-full bg-transparent text-sm text-lifewood-darkSerpent outline-none placeholder:text-lifewood-darkSerpent/42"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-lifewood-darkSerpent/65">Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-lifewood-darkSerpent/18 bg-lifewood-seasalt px-3 transition focus-within:border-lifewood-castleton/65 focus-within:bg-white">
                <LockKeyhole className="h-4 w-4 text-lifewood-castleton" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="lifewood-login-input h-11 w-full bg-transparent text-sm text-lifewood-darkSerpent outline-none placeholder:text-lifewood-darkSerpent/42"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lifewood-castleton to-[#0d8e5f] px-4 py-3 text-sm font-bold text-white transition hover:from-[#0d8e5f] hover:to-lifewood-castleton disabled:cursor-not-allowed disabled:opacity-45"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>
        </article>
      </div>

      <style>{`
        @keyframes loginFloatUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-motion {
          animation: loginFloatUp 520ms ease both;
        }
        .lifewood-login-input:-webkit-autofill,
        .lifewood-login-input:-webkit-autofill:hover,
        .lifewood-login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #133020;
          box-shadow: 0 0 0px 1000px #f9f7f7 inset;
          transition: background-color 9999s ease-out 0s;
        }
      `}</style>
    </section>
  );
};

export default LoginPortal;
