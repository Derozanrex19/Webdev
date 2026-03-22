import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import IvaChat from './components/IvaChat';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Offices from './components/Offices';
import Projects from './components/Projects';
import OfferTypePage from './components/OfferTypePage';
import PhilImpact from './components/PhilImpact';
import Careers from './components/Careers';
import CareersApplication from './components/CareersApplication';
import LoginPortal from './components/LoginPortal';
import AdminDashboard from './components/AdminDashboard';
import IvaFloatButton from './components/IvaFloatButton';
import GhostLoader from './components/GhostLoader';
import { Page } from './types';
import { supabase } from './services/supabaseClient';

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

  const syncAuthUser = useCallback(
    (user) => {
      if (!user) {
        setAuthUser(null);
        setAuthRole('intern');
        setAuthRoleLoaded(true);
        return;
      }

      // Set session identity immediately; resolve role in background.
      setAuthUser(user.email || 'User');
      setAuthRole('intern');
       setAuthRoleLoaded(false);

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
          setAuthRole('intern');
        }
        setAuthRoleLoaded(true);
      })();
    },
    [normalizeRole, withTimeout]
  );

  const [currentPage, setCurrentPage] = useState(() => getPageFromHash());
  const [loginIntent, setLoginIntent] = useState('admin');
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
        setIsIvaOpen(true);
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
    [isAuthenticated, pageToHash]
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
    setAuthUser(null);
    setAuthRole('intern');
    navigateTo(Page.HOME);
  }, [navigateTo]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash();
      if (nextPage === Page.IVA) {
        setIsIvaOpen(true);
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
  }, [getPageFromHash, pageToHash]);

  useEffect(() => {
    const openIva = () => setIsIvaOpen(true);
    window.addEventListener('open-iva', openIva);
    return () => window.removeEventListener('open-iva', openIva);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      syncAuthUser(data.session?.user || null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
        if (!authReady) {
          return (
            <section className="min-h-[calc(100vh-120px)] px-4 py-16 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-lifewood-darkSerpent/60">Loading Workspace</p>
              <div className="mt-6 flex justify-center">
                <GhostLoader label="Checking access" scale={0.24} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-lifewood-darkSerpent">Checking your account access...</h2>
            </section>
          );
        }
        return isAuthenticated && authRole === 'admin' ? (
          <AdminDashboard
            userEmail={authUser || 'User'}
            onLogout={handleLogout}
            onGoHome={() => navigateTo(Page.HOME)}
          />
        ) : !isAuthenticated ? (
          <LoginPortal
            onLogin={handleLogin}
            onSignup={handleSignup}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={handleResendOtp}
          />
        ) : (
          <section className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#0a0f0d]">
            <p className="text-white/80">You don’t have access to the admin dashboard.</p>
            <button type="button" onClick={() => navigateTo(Page.HOME)} className="mt-4 rounded-xl bg-lifewood-saffron px-5 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth transition">Go to Home</button>
          </section>
        );
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
      className={`min-h-screen flex flex-col font-sans text-lifewood-darkSerpent transition-colors duration-300 ${
        currentPage === Page.HOME ? 'bg-lifewood-darkSerpent' : currentPage === Page.INTERNAL ? 'bg-[#0a0f0d]' : 'bg-lifewood-paper'
      }`}
    >
      {currentPage !== Page.INTERNAL && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onAdminAccess={openAdminAccess}
          isAuthenticated={isAuthenticated}
          canAccessDashboard={isAuthenticated && authRole === 'admin'}
        />
      )}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {currentPage !== Page.LOGIN && (
        <IvaFloatButton onOpen={() => setIsIvaOpen(true)} />
      )}
      <IvaChat isOpen={isIvaOpen} onClose={() => setIsIvaOpen(false)} />
      {currentPage !== Page.LOGIN && currentPage !== Page.INTERNAL && <Footer onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
