import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, PhoneCall } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const socialItems = [
    { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/lifewood-data-technology/' },
    { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/lifewooddata' },
    { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/lifewood_data/' },
    { label: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/@LifewoodDataTechnology' }
  ];

  return (
    <footer className="bg-lifewood-paper pt-2">
      <div className="rounded-t-[18px] bg-gradient-to-r from-[#063320] via-[#04512f] to-[#0a3c2a] px-4 py-5 text-lifewood-paper sm:px-6 sm:py-6 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => onNavigate(Page.HOME)}
                className="transition-opacity hover:opacity-90"
              >
                <img
                  src="/lifewood-logo-custom.svg"
                  alt="Lifewood"
                  className="brand-logo h-8 w-auto object-contain"
                />
              </button>
            </div>

            <p className="max-w-[700px] text-sm leading-snug text-lifewood-paper/95 sm:text-base">
              We provide global Data Engineering Services to enable AI Solutions.
            </p>

            <button
              onClick={() => onNavigate(Page.CONTACT)}
              className="mt-4 text-left text-xl font-medium leading-none text-lifewood-paper transition-colors hover:text-lifewood-saffron sm:text-2xl"
            >
              Contact Us
            </button>

          </div>

          <div className="w-full max-w-sm">
            <p className="mb-2 text-left text-[11px] uppercase tracking-wide text-lifewood-paper/80 lg:text-right">Find Us On</p>
            <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 lg:justify-end">
              {socialItems.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-w-[64px] flex-col items-center gap-1 text-lifewood-paper transition-colors hover:text-lifewood-saffron"
                >
                  <Icon className="h-4 w-4 stroke-[1.75]" />
                  <span className="text-[10px] sm:text-xs">{label}</span>
                </a>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-start gap-3 lg:justify-end">
              <p className="text-xs text-lifewood-paper/95">&copy; {new Date().getFullYear()} Lifewood</p>
              <button
                onClick={() => onNavigate(Page.CONTACT)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white px-1 py-1 text-[10px] font-semibold text-[#0b2d1f] shadow-md transition-transform hover:scale-[1.02]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-lifewood-saffron text-lifewood-darkSerpent">
                  <PhoneCall className="h-3 w-3" />
                </span>
                <span className="rounded-full bg-[#0b2d1f] px-2.5 py-1 text-white">Start a call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
