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
import { Page } from './types';

const App = () => {
  const pageToHash = useMemo(
    () => ({
      [Page.HOME]: 'home',
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

  const [currentPage, setCurrentPage] = useState(() => getPageFromHash());

  const navigateTo = useCallback(
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

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={navigateTo} />;
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
      className={`min-h-screen flex flex-col font-sans text-lifewood-darkSerpent ${
        currentPage === Page.HOME ? 'bg-lifewood-darkSerpent' : 'bg-lifewood-paper'
      }`}
    >
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
