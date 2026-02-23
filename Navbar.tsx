import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

interface NavChildItem {
  label: string;
  page: Page;
}

interface NavItem {
  label: string;
  page?: Page;
  children?: NavChildItem[];
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAuthenticated = false,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll();

  const navItems: NavItem[] = [
    { label: 'Home', page: Page.HOME },
    {
      label: 'AI Initiatives',
      children: [
        { label: 'AI Data Services', page: Page.SERVICES },
        { label: 'Projects', page: Page.PROJECTS },
      ],
    },
    {
      label: 'Our Company',
      children: [
        { label: 'About Us', page: Page.ABOUT },
        { label: 'Global Offices', page: Page.OFFICES },
      ],
    },
    {
      label: 'What We Offer',
      children: [
        { label: 'Type A - Data Service', page: Page.TYPE_A },
        { label: 'Type B - Vertical LLM Data', page: Page.TYPE_B },
        { label: 'Type C - Horizontal LLM Data', page: Page.TYPE_C },
        { label: 'Type D - AIGC Content', page: Page.TYPE_D },
      ],
    },
    { label: 'Philanthropy & Impact', page: Page.PHIL_IMPACT },
    { label: 'Careers', page: Page.CAREERS },
    { label: 'Contact Us', page: Page.CONTACT },
  ];

  const isItemActive = (item: NavItem) => {
    if (item.page) return currentPage === item.page;
    if (item.children) return item.children.some((child) => child.page === currentPage);
    return false;
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenDropdown(null);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isMenuOpen) {
      setIsHidden(false);
      return;
    }
    if (current > previous && current > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <motion.nav
      ref={navRef}
      className="sticky top-0 z-50 px-2 pt-2 md:px-4 md:pt-2"
      animate={{
        y: isHidden ? -110 : 0,
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        y: { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 },
        opacity: { duration: 0.22, ease: 'easeOut' },
      }}
    >
      <div className="nav-glass-shell relative isolate mx-auto max-w-7xl overflow-visible rounded-full">
        <div className="relative flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex shrink-0 cursor-pointer items-center gap-3" onClick={() => onNavigate(Page.HOME)}>
            <img
              src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png"
              alt="Lifewood"
              className="brand-logo h-9 w-auto object-contain"
            />
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isItemActive(item);

              if (item.children) {
                const opened = openDropdown === item.label;
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(opened ? null : item.label)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        active ? 'text-lifewood-saffron' : 'text-lifewood-darkSerpent hover:bg-white/70'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition ${opened ? 'rotate-180' : ''}`} />
                    </button>

                    {opened && (
                      <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-2 shadow-xl backdrop-blur-lg">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => {
                              onNavigate(child.page);
                              setOpenDropdown(null);
                            }}
                            className={`block w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
                              currentPage === child.page
                                ? 'bg-lifewood-seasalt text-lifewood-castleton'
                                : 'text-lifewood-darkSerpent hover:bg-lifewood-seasalt'
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.page as Page);
                    setOpenDropdown(null);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    active ? 'text-lifewood-saffron' : 'text-lifewood-darkSerpent hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(Page.INTERNAL);
                    setOpenDropdown(null);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    currentPage === Page.INTERNAL ? 'text-lifewood-saffron' : 'text-lifewood-darkSerpent hover:bg-white/70'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout?.();
                    setOpenDropdown(null);
                  }}
                  className="rounded-full border border-lifewood-darkSerpent/20 px-3 py-1.5 text-sm font-semibold text-lifewood-darkSerpent transition hover:bg-white/70"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate(Page.LOGIN);
                  setOpenDropdown(null);
                }}
                className={`rounded-full border border-lifewood-darkSerpent/20 px-3 py-1.5 text-sm font-semibold transition ${
                  currentPage === Page.LOGIN ? 'bg-white/70 text-lifewood-castleton' : 'text-lifewood-darkSerpent hover:bg-white/70'
                }`}
              >
                Log In
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full p-2 text-lifewood-darkSerpent hover:bg-white/70"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="nav-glass-menu mx-auto mt-3 max-h-[calc(100dvh-5.5rem)] max-w-7xl overflow-y-auto rounded-3xl p-4 overscroll-contain lg:hidden">
          <div className="space-y-2">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="rounded-2xl bg-white/80 p-2">
                    <div className="px-3 py-2 text-base font-bold text-lifewood-darkSerpent">{item.label}</div>
                    <div className="space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => {
                            onNavigate(child.page);
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                            currentPage === child.page
                              ? 'bg-lifewood-seasalt text-lifewood-castleton'
                              : 'text-lifewood-darkSerpent hover:bg-lifewood-seasalt'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.page as Page);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-base font-semibold transition ${
                    isItemActive(item) ? 'bg-lifewood-seasalt text-lifewood-castleton' : 'text-lifewood-darkSerpent hover:bg-lifewood-seasalt'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(Page.INTERNAL);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-base font-semibold transition ${
                    currentPage === Page.INTERNAL ? 'bg-lifewood-seasalt text-lifewood-castleton' : 'text-lifewood-darkSerpent hover:bg-lifewood-seasalt'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-lifewood-darkSerpent transition hover:bg-lifewood-seasalt"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate(Page.LOGIN);
                  setIsMenuOpen(false);
                }}
                className={`block w-full rounded-xl px-3 py-2 text-left text-base font-semibold transition ${
                  currentPage === Page.LOGIN ? 'bg-lifewood-seasalt text-lifewood-castleton' : 'text-lifewood-darkSerpent hover:bg-lifewood-seasalt'
                }`}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
