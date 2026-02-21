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
import LoginPortal from './components/LoginPortal';
import InternalDashboard from './components/InternalDashboard';
import IvaFloatButton from './components/IvaFloatButton';
import { Page } from './types';

const App = () => {
  const AUTH_KEY = 'lifewood_demo_auth_user';
  const THEME_KEY = 'lifewood_theme_mode';
  const DEMO_USERNAME = 'test1';
  const DEMO_PASSWORD = '12345678';

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

  const [authUser, setAuthUser] = useState(() => {
    try {
      return window.localStorage.getItem(AUTH_KEY);
    } catch {
      return null;
    }
  });
  const isAuthenticated = Boolean(authUser);

  const [currentPage, setCurrentPage] = useState(() => getPageFromHash());
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
    } catch {
      // ignore storage read errors
    }
    return 'light';
  });

  const isDarkMode = themeMode === 'dark';

  const navigateTo = useCallback(
    (page) => {
      if (page === Page.INTERNAL && !isAuthenticated) {
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

  const handleLogin = useCallback(
    (username, password) => {
      if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
        return { ok: false, error: 'Invalid username or password.' };
      }

      try {
        window.localStorage.setItem(AUTH_KEY, DEMO_USERNAME);
      } catch {
        // no-op for storage-restricted contexts
      }
      setAuthUser(DEMO_USERNAME);
      navigateTo(Page.INTERNAL);
      return { ok: true };
    },
    [navigateTo]
  );

  const handleLogout = useCallback(() => {
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch {
      // no-op for storage-restricted contexts
    }
    setAuthUser(null);
    navigateTo(Page.HOME);
  }, [navigateTo]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${pageToHash[Page.HOME]}`);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getPageFromHash, pageToHash]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, themeMode);
    } catch {
      // ignore storage write errors
    }
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleThemeMode = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={navigateTo} />;
      case Page.LOGIN:
        return <LoginPortal onLogin={handleLogin} />;
      case Page.INTERNAL:
        return isAuthenticated ? (
          <InternalDashboard userEmail={authUser || DEMO_USERNAME} onLogout={handleLogout} />
        ) : (
          <LoginPortal onLogin={handleLogin} />
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
      case Page.IVA:
        return <IvaChat />;
      case Page.CONTACT:
        return <Contact />;
      default:
        return <Hero onNavigate={navigateTo} />;
    }
  };

  return (
    <div
      className={`${isDarkMode ? 'theme-dark' : 'theme-light'} min-h-screen flex flex-col font-sans text-lifewood-darkSerpent transition-colors duration-300 ${
        currentPage === Page.HOME ? 'bg-lifewood-darkSerpent' : currentPage === Page.INTERNAL ? 'bg-[#0a0f0d]' : 'bg-lifewood-paper'
      }`}
    >
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleThemeMode}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      {currentPage !== Page.IVA && currentPage !== Page.LOGIN && (
        <IvaFloatButton onNavigate={navigateTo} />
      )}
      {currentPage !== Page.LOGIN && currentPage !== Page.INTERNAL && <Footer onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
