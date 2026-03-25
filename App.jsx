import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GhostLoader from './components/GhostLoader';
import { Page } from './types';
import { supabase } from './services/supabaseClient';

const Grainient = lazy(() => import('./components/Grainient'));
const FloatingLines = lazy(() => import('./components/FloatingLines'));
const Home = lazy(() => import('./components/Home'));
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const About = lazy(() => import('./components/About'));
const IvaChat = lazy(() => import('./components/IvaChat'));
const Contact = lazy(() => import('./components/Contact'));
const Offices = lazy(() => import('./components/Offices'));
const Projects = lazy(() => import('./components/Projects'));
const OfferTypePage = lazy(() => import('./components/OfferTypePage'));
const PhilImpact = lazy(() => import('./components/PhilImpact'));
const Careers = lazy(() => import('./components/Careers'));
const CareersApplication = lazy(() => import('./components/CareersApplication'));
const LoginPortal = lazy(() => import('./components/LoginPortal'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const IvaFloatButton = lazy(() => import('./components/IvaFloatButton'));

const EXPLICIT_LOGIN_SESSION_KEY = 'lifewood-explicit-admin-login';

const PageLoader = ({ label = 'Loading page' }) => (
  <section className="min-h-[calc(100vh-120px)] px-4 py-16 text-center">
    <p className="text-sm uppercase tracking-[0.2em] text-lifewood-darkSerpent/60">{label}</p>
    <div className="mt-6 flex justify-center">
      <GhostLoader label={label} scale={0.24} />
    </div>
  </section>
);

const App = () => {
  const withTimeout = useCallback(
    async (promise, ms = 15000) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          window.setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms)
        ),
      ]);
    },
    []
  );

  const pageToHash = useMemo(
    () => ({
      [Page.HOME]: 'home',
      [Page.LOGIN]: 'login',
      [Page.INTERNAL]: 'internal',
      [Page.SERVICES]: 'ai-data-services',
      [Page.PROJECTS]: 'ai-projects',
      [Page.ABOUT]: 'about',
      [Page.OFFICES]: 'global-offices',
      [Page.TYPE_A]: 'type-a',
      [Page.TYPE_B]: 'type-b',
      [Page.TYPE_C]: 'type-c',
      [Page.TYPE_D]: 'type-d',
      [Page.PHIL_IMPACT]: 'philanthropy-impact',
      [Page.CAREERS]: 'careers',
      [Page.CAREERS_APPLY]: 'careers-apply',
      [Page.CONTACT]: 'contact',
      [Page.IVA]: 'iva',
    }),
    []
  );

  const hashToPage = useMemo(() => {
    const entries = Object.entries(pageToHash).map(([page, hash]) => [hash, page]);
    return new Map(entries);
  }, [pageToHash]);

  const getPageFromHash = useCallback(() => {
    const normalizedHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    return hashToPage.get(normalizedHash) || Page.HOME;
  }, [hashToPage]);

  const [authUser, setAuthUser] = useState(null);
  const [authRole, setAuthRole] = useState('intern');
  const [authRoleLoaded, setAuthRoleLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isIvaOpen, setIsIvaOpen] = useState(false);
  const isAuthenticated = Boolean(authUser);

  const normalizeRole = useCallback((role) => (role === 'admin' ? 'admin' : 'intern'), []);

  const lastSyncedUid = React.useRef(null);

  const syncAuthUser = useCallback(
    (user) => {
      if (!user) {
        lastSyncedUid.current = null;
        setAuthUser(null);
        setAuthRole('intern');
        setAuthRoleLoaded(true);
        return;
      }

      setAuthUser(user.email || 'User');

      // If the same user is re-syncing (e.g. tab focus), keep the current role
      // and just refresh it in the background without resetting to 'intern'.
      const isSameUser = lastSyncedUid.current === user.id;
      lastSyncedUid.current = user.id;

      if (!isSameUser) {
        setAuthRole('intern');
        setAuthRoleLoaded(false);
      }

      void (async () => {
        try {
          const { data } = await withTimeout(
            supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle(),
            6000
          );
          setAuthRole(normalizeRole(data?.role));
        } catch {
          if (!isSameUser) {
            setAuthRole('intern');
          }
        }
        setAuthRoleLoaded(true);
      })();
    },
    [normalizeRole, withTimeout]
  );

  const [currentPage, setCurrentPage] = useState(() => getPageFromHash());
  const [loginIntent, setLoginIntent] = useState('admin');
  const isAdminWorkspace =
    currentPage === Page.INTERNAL && authReady && authRoleLoaded && isAuthenticated && authRole === 'admin';
  const forceNavigateTo = useCallback(
    (page) => {
      setCurrentPage(page);
      const targetHash = pageToHash[page];
      if (!targetHash) return;
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (currentHash !== targetHash) {
        window.history.pushState(null, '', `#${targetHash}`);
      }
    },
    [pageToHash]
  );

  const navigateTo = useCallback(
    (page) => {
      if (page === Page.IVA) {
        if (isAdminWorkspace) {
          setIsIvaOpen(true);
        }
        return;
      }
      if (page === Page.INTERNAL && !isAuthenticated) {
        setLoginIntent('admin');
        page = Page.LOGIN;
      }
      setCurrentPage(page);
      const targetHash = pageToHash[page];
      if (!targetHash) return;
      const currentHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (currentHash !== targetHash) {
        window.history.pushState(null, '', `#${targetHash}`);
      }
    },
    [isAdminWorkspace, isAuthenticated, pageToHash]
  );

  const openAdminAccess = useCallback(() => {
    setLoginIntent('admin');
    forceNavigateTo(Page.LOGIN);
  }, [forceNavigateTo]);

  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const { data, error } = await withTimeout(
          supabase.auth.signInWithPassword({
            email,
            password,
          })
        );
        if (error || !data.user) {
          return { ok: false, error: error?.message || 'Invalid email or password.' };
        }

        const user = data.user;
        window.sessionStorage.setItem(EXPLICIT_LOGIN_SESSION_KEY, '1');
        let role = 'intern';
        try {
          const { data: profile } = await withTimeout(
            supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle(),
            6000
          );
          role = profile?.role === 'admin' ? 'admin' : 'intern';
        } catch {
          role = 'intern';
        }

        syncAuthUser(user);
        if (role === 'admin') {
          forceNavigateTo(Page.INTERNAL);
        } else {
          forceNavigateTo(Page.HOME);
        }

        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : 'Network error while signing in. Please try again.',
        };
      }
    },
    [forceNavigateTo, syncAuthUser, withTimeout]
  );

  const handleSignup = useCallback(
    async (email, password, displayName) => {
      try {
        const { error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName?.trim() || email,
                full_name: displayName?.trim() || email,
              },
            },
          })
        );
        if (error) {
          return { ok: false, error: error.message || 'Unable to create account right now.' };
        }
        return {
          ok: true,
          message: `A code has been sent to ${email}.`,
          requiresOtp: true,
          email,
        };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : 'Network error while creating account. Please try again.',
        };
      }
    },
    [withTimeout]
  );

  const handleVerifyOtp = useCallback(
    async (email, token) => {
      try {
        const { data, error } = await withTimeout(
          supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
          })
        );
        if (error) {
          return { ok: false, error: error.message || 'Invalid code.' };
        }
        syncAuthUser(data.user || data.session?.user || null);
        // New signups are not admins by default; send them to home.
        forceNavigateTo(Page.HOME);
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : 'Network error while verifying code. Please try again.',
        };
      }
    },
    [forceNavigateTo, syncAuthUser, withTimeout]
  );

  const handleResendOtp = useCallback(async (email) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.resend({
          type: 'signup',
          email,
        })
      );
      if (error) {
        return { ok: false, error: error.message || 'Unable to resend code.' };
      }
      return { ok: true, message: `A new code was sent to ${email}.` };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : 'Network error while resending code. Please try again.',
      };
    }
  }, [withTimeout]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.sessionStorage.removeItem(EXPLICIT_LOGIN_SESSION_KEY);
    setAuthUser(null);
    setAuthRole('intern');
    navigateTo(Page.HOME);
  }, [navigateTo]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash();
      if (nextPage === Page.IVA) {
        if (isAdminWorkspace) {
          setIsIvaOpen(true);
        }
        window.history.replaceState(null, '', `#${pageToHash[Page.HOME]}`);
        setCurrentPage(Page.HOME);
        return;
      }
      setCurrentPage(nextPage);
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${pageToHash[Page.HOME]}`);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getPageFromHash, isAdminWorkspace, pageToHash]);

  useEffect(() => {
    const openIva = () => {
      if (isAdminWorkspace) {
        setIsIvaOpen(true);
      }
    };
    window.addEventListener('open-iva', openIva);
    return () => window.removeEventListener('open-iva', openIva);
  }, [isAdminWorkspace]);

  useEffect(() => {
    if (!isAdminWorkspace && isIvaOpen) {
      setIsIvaOpen(false);
    }
  }, [isAdminWorkspace, isIvaOpen]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const hasExplicitLogin = window.sessionStorage.getItem(EXPLICIT_LOGIN_SESSION_KEY) === '1';
      if (data.session?.user && !hasExplicitLogin) {
        void supabase.auth.signOut().finally(() => {
          if (!mounted) return;
          syncAuthUser(null);
          setAuthReady(true);
        });
        return;
      }
      syncAuthUser(data.session?.user || null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        window.sessionStorage.removeItem(EXPLICIT_LOGIN_SESSION_KEY);
      }
      syncAuthUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncAuthUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  useEffect(() => {
    if (!authReady) return;
    if (isAuthenticated && !authRoleLoaded) return;
    if (currentPage === Page.INTERNAL && !isAuthenticated) {
      navigateTo(Page.LOGIN);
    } else if (currentPage === Page.INTERNAL && isAuthenticated && authRole !== 'admin') {
      navigateTo(Page.HOME);
    }
  }, [authReady, currentPage, isAuthenticated, authRole, navigateTo]);

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={navigateTo} />;
      case Page.LOGIN:
        return (
          <LoginPortal
            adminOnly={loginIntent === 'admin'}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={handleResendOtp}
          />
        );
      case Page.INTERNAL:
        if (!authReady || (isAuthenticated && !authRoleLoaded)) {
          return (
            <section className="min-h-[calc(100vh-120px)] px-4 py-16 text-center bg-[#0a0f0d]">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">Loading Workspace</p>
              <div className="mt-6 flex justify-center">
                <GhostLoader label="Checking access" scale={0.24} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-white">Checking your account access...</h2>
            </section>
          );
        }
        if (isAuthenticated && authRole === 'admin') {
          return (
            <AdminDashboard
              userEmail={authUser || 'User'}
              onLogout={handleLogout}
              onGoHome={() => navigateTo(Page.HOME)}
            />
          );
        }
        if (!isAuthenticated) {
          return (
            <LoginPortal
              onLogin={handleLogin}
              onSignup={handleSignup}
              onVerifyOtp={handleVerifyOtp}
              onResendOtp={handleResendOtp}
            />
          );
        }
        navigateTo(Page.HOME);
        return null;
      case Page.SERVICES:
        return (
          <div className="pt-10">
             <Services />
          </div>
        );
      case Page.TYPE_A:
        return <OfferTypePage type="A" onNavigate={navigateTo} />;
      case Page.TYPE_B:
        return <OfferTypePage type="B" onNavigate={navigateTo} />;
      case Page.TYPE_C:
        return <OfferTypePage type="C" onNavigate={navigateTo} />;
      case Page.TYPE_D:
        return <OfferTypePage type="D" onNavigate={navigateTo} />;
      case Page.PHIL_IMPACT:
        return <PhilImpact onNavigate={navigateTo} />;
      case Page.CAREERS:
        return <Careers onNavigate={navigateTo} />;
      case Page.CAREERS_APPLY:
        return <CareersApplication onNavigate={navigateTo} />;
      case Page.PROJECTS:
        return <Projects onNavigate={navigateTo} />;
      case Page.ABOUT:
        return (
          <div className="pt-10">
             <About onNavigate={navigateTo} />
          </div>
        );
      case Page.OFFICES:
        return <Offices />;
      case Page.CONTACT:
        return <Contact />;
      default:
        return <Hero onNavigate={navigateTo} />;
    }
  };

  return (
    <div
      className={`relative isolate min-h-screen flex flex-col overflow-hidden font-sans text-lifewood-darkSerpent transition-colors duration-300 ${
        currentPage === Page.HOME
          ? 'bg-lifewood-darkSerpent'
          : currentPage === Page.INTERNAL
            ? 'bg-[#0a0f0d]'
            : currentPage === Page.LOGIN
              ? 'bg-[#0b1813]'
              : 'bg-lifewood-paper'
      }`}
    >
      {currentPage === Page.LOGIN && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <Suspense fallback={null}>
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
          </Suspense>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_88%_6%,rgba(255,179,71,0.10),transparent_38%),linear-gradient(to_bottom,rgba(249,247,247,0.18),rgba(249,247,247,0.28))]" />
        </div>
      )}
      {currentPage === Page.HOME && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden bg-lifewood-darkSerpent md:h-[100dvh]">
          <Suspense fallback={null}>
            <FloatingLines
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={[4, 6, 5]}
              lineDistance={[4.6, 5.2, 4.2]}
              bendRadius={4.4}
              bendStrength={-0.42}
              interactive
              parallax
              parallaxStrength={0.12}
              animationSpeed={0.78}
              linesGradient={['#0e5f3d', '#1f7a4f', '#ffb347', '#f4d0a4']}
              topWavePosition={{ x: 8.8, y: 0.55, rotate: -0.38 }}
              middleWavePosition={{ x: 4.4, y: -0.02, rotate: 0.18 }}
              bottomWavePosition={{ x: 1.6, y: -0.66, rotate: 0.34 }}
            />
          </Suspense>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_34%,rgba(255,179,71,0.19),transparent_52%)] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,18,0.30)_0%,rgba(8,27,19,0.48)_58%,rgba(8,27,19,0.72)_100%)]"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-lifewood-darkSerpent"></div>
        </div>
      )}
      {currentPage !== Page.INTERNAL && (
        <div className="relative z-40">
          <Navbar
            currentPage={currentPage}
            onNavigate={navigateTo}
            onAdminAccess={openAdminAccess}
            isAuthenticated={authReady && authRoleLoaded && isAuthenticated}
            canAccessDashboard={authReady && authRoleLoaded && isAuthenticated && authRole === 'admin'}
          />
        </div>
      )}
      <main className="relative z-10 flex-grow">
        <Suspense fallback={<PageLoader label="Loading section" />}>{renderContent()}</Suspense>
      </main>
      {isAdminWorkspace && (
        <Suspense fallback={null}>
          <IvaFloatButton onOpen={() => setIsIvaOpen(true)} />
        </Suspense>
      )}
      {isAdminWorkspace && (
        <Suspense fallback={null}>
          <IvaChat isOpen={isIvaOpen} onClose={() => setIsIvaOpen(false)} adminOnly />
        </Suspense>
      )}
      {currentPage !== Page.LOGIN && currentPage !== Page.INTERNAL && (
        <div className="relative z-10">
          <Footer onNavigate={navigateTo} />
        </div>
      )}
    </div>
  );
};

export default App;
