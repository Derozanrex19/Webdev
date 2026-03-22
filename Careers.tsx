import React from 'react';
import { ArrowRight, Briefcase, Clock3, MapPin } from 'lucide-react';
import { Page } from '../types';
import SplitText from './SplitText';

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

const cultureCards = [
  {
    title: 'Operational Thinking',
    copy: 'We build teams that can execute clearly, learn quickly, and deliver consistently across high-volume AI workflows.',
    image:
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop&dpr=2',
  },
  {
    title: 'Global Collaboration',
    copy: 'Our work sits across regions, disciplines, and delivery models. Communication quality matters as much as raw output.',
    image:
      'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop&dpr=2',
  },
  {
    title: 'Career Momentum',
    copy: 'We look for people who want meaningful responsibility, not passive seats. Ownership is part of the culture from day one.',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop&dpr=2',
  },
];

const statChips = [
  { icon: Briefcase, label: 'Role-first hiring', value: 'Applied execution' },
  { icon: MapPin, label: 'Global teams', value: 'Cross-market delivery' },
  { icon: Clock3, label: 'Fast-moving work', value: 'Built for momentum' },
];

const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  const loopA = [...traits, ...traits, ...traits, ...traits];
  const loopB = [...traits.slice(3), ...traits.slice(0, 3), ...traits.slice(3), ...traits.slice(0, 3)];

  return (
    <section className="careers-page relative overflow-hidden bg-[#f2efe7] pb-20 pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,179,71,0.12),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(4,98,65,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.38),rgba(243,239,231,0.92))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="overflow-hidden rounded-[36px] border border-black/8 bg-white/82 p-7 shadow-[0_20px_46px_rgba(15,39,28,0.10)] backdrop-blur-sm md:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-lifewood-castleton">
              Careers Architecture
            </p>
            <h1 className="careers-title mt-4 max-w-3xl text-[3.2rem] font-black leading-[0.92] tracking-[-0.04em] text-black sm:text-[4.2rem] lg:text-[5.35rem]">
              Build work that scales with people, systems, and purpose.
            </h1>
            <p className="careers-lead mt-6 max-w-2xl text-lg leading-8 text-black/72 sm:text-[1.2rem]">
              Lifewood hires for clarity, adaptability, and operational discipline. We are building teams that can support AI delivery at enterprise scale without losing human judgment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate(Page.CAREERS_APPLY)}
                className="careers-cta inline-flex h-12 items-stretch overflow-hidden rounded-full border border-[#de9f31] bg-lifewood-saffron text-lifewood-darkSerpent transition hover:-translate-y-0.5 hover:brightness-95"
              >
                <span className="inline-flex items-center px-6 text-[1.15rem] font-bold leading-none">
                  Start Application
                </span>
                <span className="w-px bg-[#cf8d22]" />
                <span className="inline-flex items-center px-5">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(Page.CONTACT)}
                className="inline-flex h-12 items-center rounded-full border border-lifewood-darkSerpent/14 bg-transparent px-5 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-white/70"
              >
                Talk to Recruitment
              </button>
            </div>
          </article>

          <article className="grid gap-4">
            <div className="overflow-hidden rounded-[32px] border border-black/8 bg-[#0d1d17] p-5 text-white shadow-[0_18px_38px_rgba(6,30,21,0.18)] md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron/90">
                What changes here
              </p>
              <p className="mt-3 text-2xl font-semibold leading-tight md:text-[2rem]">
                We are not hiring for headcount. We are hiring for strong operators.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70 md:text-[0.98rem]">
                The strongest candidates think clearly, write clearly, and adapt fast when the work evolves.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {statChips.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-[28px] border border-black/8 bg-white/82 p-5 shadow-[0_14px_26px_rgba(15,39,28,0.08)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lifewood-seasalt text-lifewood-castleton">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-black/48">
                    {label}
                  </p>
                  <p className="mt-2 text-base font-semibold leading-snug text-black/86">{value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-black/8 bg-[#10231b] p-6 text-white shadow-[0_18px_34px_rgba(4,31,20,0.16)] md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Hiring Lens</p>
            <p className="mt-4 text-[1.75rem] font-semibold leading-[1.08] md:text-[2.2rem]">
              Communication, accountability, and growth mindset matter just as much as technical skill.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-[0.98rem]">
              We value people who can move with structure, respond well to feedback, and handle responsibility without waiting to be told every next step.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {cultureCards.map((card, index) => (
              <article
                key={card.title}
                className={`group overflow-hidden rounded-[30px] border border-black/8 bg-white/84 shadow-[0_16px_28px_rgba(15,39,28,0.08)] transition duration-300 hover:-translate-y-1 ${
                  index === 1 ? 'md:translate-y-8' : ''
                }`}
              >
                <div className="overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold leading-tight text-black/88">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-black/66">{card.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="relative z-10 mt-14 space-y-2 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-2">
          {loopA.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex h-9 items-center rounded-full border border-[#d8d0a8] bg-[#ece7c9] px-4 text-sm font-semibold text-lifewood-darkSerpent"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="marquee-track careers-marquee-reverse flex w-max items-center gap-2">
          {loopB.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex h-9 items-center rounded-full border border-[#d8d0a8] bg-[#ece7c9] px-4 text-sm font-semibold text-lifewood-darkSerpent"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-[38px] border border-black/8 bg-white/78 px-6 py-10 shadow-[0_18px_32px_rgba(15,39,28,0.08)] backdrop-blur-sm md:px-10 md:py-12">
          <SplitText
            text="If you are looking for work that asks more of your thinking, your judgment, and your discipline, this is where the conversation starts."
            className="careers-quote text-[2rem] leading-[1.18] tracking-[-0.03em] text-black md:text-[3.35rem]"
            delay={16}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.15}
            rootMargin="-80px"
            textAlign="center"
            tag="p"
          />
          <p className="careers-tagline mt-5 text-lg text-black/62 md:text-[1.4rem]">
            Work with structure. Grow with range. Deliver with intent.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] bg-gradient-to-r from-[#0b2f21] via-[#0a4d31] to-[#0b2f21] px-6 py-10 text-white shadow-[0_18px_34px_rgba(4,31,20,0.24)] sm:px-8 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <img src="/lifewood-logo-custom.svg" alt="Lifewood" className="h-10 w-auto" />
              <p className="mt-6 max-w-4xl text-2xl font-medium leading-tight md:text-[2.2rem]">
                We provide global Data Engineering Services that turn disciplined teams into real AI delivery capability.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                onClick={() => onNavigate(Page.CAREERS_APPLY)}
                className="careers-contact-btn inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-5 py-2.5 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate(Page.CONTACT)}
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/16"
              >
                Contact Us
              </button>
            </div>
          </div>
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
