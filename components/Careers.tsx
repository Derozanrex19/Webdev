import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface CareersProps {
  onNavigate: (page: Page) => void;
}

const traits = [
  'Adaptive',
  'Flexible',
  'Supportive',
  'Collaborative',
  'Innovative',
  'Trustworthy',
  'Professional',
  'Reliable',
  'Balanced',
  'Always-On',
];

const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  const loopA = [...traits, ...traits, ...traits, ...traits];
  const loopB = [...traits.slice(4), ...traits.slice(0, 4), ...traits.slice(4), ...traits.slice(0, 4)];

  return (
    <section className="relative overflow-hidden bg-[#f3f3f3] pb-16 pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,179,71,0.10),transparent_38%),radial-gradient(circle_at_86%_76%,rgba(4,98,65,0.08),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-1 gap-10 pt-2 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="animate-[fadeUp_700ms_ease-out]">
            <h1 className="max-w-xl text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-black sm:text-6xl md:text-7xl">
              Careers in Lifewood
            </h1>

            <a
              href="https://application-form-ph.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-stretch overflow-hidden rounded-full border border-[#de9f31] bg-lifewood-saffron text-lifewood-darkSerpent transition hover:brightness-95"
            >
              <span className="inline-flex items-center px-6 text-[1.65rem] font-bold leading-none">Join Us</span>
              <span className="w-px bg-[#cf8d22]" />
              <span className="inline-flex items-center px-5">
                <ArrowRight className="h-5 w-5" />
              </span>
            </a>
          </div>

          <p className="animate-[fadeUp_860ms_ease-out] text-2xl leading-[1.45] text-black/88 sm:text-[1.9rem] lg:pb-2">
            Innovation, adaptability, and rapid service evolution separate organizations that consistently deliver at the highest level.
          </p>
        </header>

        <section className="mt-14 animate-[fadeUp_900ms_ease-out]">
          <div className="overflow-hidden rounded-[44px] border border-black/8 bg-black shadow-[0_16px_36px_rgba(0,0,0,0.16)]">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1200&fit=crop&dpr=2"
              alt="Lifewood careers team collaboration"
              className="h-[260px] w-full object-cover sm:h-[340px] md:h-[430px] lg:h-[480px]"
            />
          </div>
        </section>
      </div>

      <section className="relative z-10 mt-12 space-y-2 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-2">
          {loopA.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex h-9 items-center rounded-sm border border-[#d8d0a8] bg-[#e8e5c7] px-4 text-sm font-semibold text-lifewood-darkSerpent"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="marquee-track careers-marquee-reverse flex w-max items-center gap-2">
          {loopB.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex h-9 items-center rounded-sm border border-[#d8d0a8] bg-[#e8e5c7] px-4 text-sm font-semibold text-lifewood-darkSerpent"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="animate-[fadeUp_960ms_ease-out] text-[2rem] leading-[1.3] tracking-[-0.02em] text-black md:text-[3.3rem]">
          If you&apos;re ready to turn the page on a new chapter in your career, connect with us today. At Lifewood,
          the adventure is always ahead.
        </p>
        <p className="mt-4 animate-[fadeUp_1050ms_ease-out] text-lg text-black/65 md:text-2xl">&quot;Always on, never off.&quot;</p>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[38px] bg-gradient-to-r from-[#0b2f21] via-[#0a4d31] to-[#0b2f21] px-6 py-10 text-white shadow-[0_18px_34px_rgba(4,31,20,0.24)] sm:px-8 md:px-10">
          <img src="/lifewood-logo-custom.svg" alt="Lifewood" className="h-10 w-auto" />
          <p className="mt-6 max-w-4xl text-2xl font-medium leading-tight md:text-[2.2rem]">
            We provide global Data Engineering Services to enable AI solutions.
          </p>
          <button
            onClick={() => onNavigate(Page.CONTACT)}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-5 py-2.5 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .careers-marquee-reverse {
          animation-direction: reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .careers-marquee-reverse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Careers;
