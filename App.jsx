import React, { useEffect, useState } from 'react';
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
import { Page } from './types';

const App = () => {
  const [currentPage, setCurrentPage] = useState(Page.HOME);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={setCurrentPage} />;
      case Page.SERVICES:
        return (
          <div className="pt-10">
             <Services />
          </div>
        );
      case Page.TYPE_A:
        return <OfferTypePage type="A" />;
      case Page.TYPE_B:
        return <OfferTypePage type="B" />;
      case Page.TYPE_C:
        return <OfferTypePage type="C" />;
      case Page.TYPE_D:
        return <OfferTypePage type="D" />;
      case Page.PHIL_IMPACT:
        return <PhilImpact />;
      case Page.PROJECTS:
        return <Projects />;
      case Page.ABOUT:
        return (
          <div className="pt-10">
             <About />
          </div>
        );
      case Page.OFFICES:
        return <Offices />;
      case Page.IVA:
        return <IvaChat />;
      case Page.CONTACT:
        return <Contact />;
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans text-lifewood-darkSerpent ${
        currentPage === Page.HOME ? 'bg-lifewood-darkSerpent' : 'bg-lifewood-paper'
      }`}
    >
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
