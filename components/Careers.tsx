import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface CareersProps {
  onNavigate: (page: Page) => void;
}

const pillars = [
  {
    title: 'Purpose and Craft',
    body: 'We build meaningful outcomes through disciplined execution, strong ownership, and respect for quality at every stage.',
    image:
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
  },
  {
    title: 'Global Collaboration',
    body: 'Our teams operate across regions and cultures, creating a workplace where local insight and global scale strengthen each other.',
    image:
      'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
  },
  {
    title: 'Continuous Growth',
    body: 'You will work on modern AI-enabled workflows, learn quickly, and expand your responsibilities in a high-trust environment.',
    image:
      'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
  },
];

const roles = [
  'Project Operations',
  'Data Annotation and QA',
  'AI Content Production',
  'Localization and Language Services',
  'Client Delivery',
  'People and Culture',
];

const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#f2f2f2] pb-20 pt-14">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-[fadeUp_700ms_ease-out]">
          <div className="mb-3 inline-flex items-center gap-1.5 text-lifewood-darkSerpent/70">
            <span className="h-3 w-3 rounded-full bg-black"></span>
            <span className="h-3 w-3 rounded-full border border-black"></span>
            <span className="ml-1 block h-px w-24 bg-lifewood-darkSerpent/35"></span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-black md:text-6xl">Careers at Lifewood</h1>
          <p className="mt-5 max-w-4xl text-[1.02rem] leading-relaxed text-lifewood-darkSerpent/78">
            We are building teams of thoughtful, ambitious people who care about quality, impact, and long-term growth.
            Join us to create work that matters across global markets.
          </p>

          <button
            onClick={() => onNavigate(Page.CONTACT)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-4 py-2 text-xs font-bold text-lifewood-darkSerpent"
          >
            Contact Us
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-lifewood-castleton text-white">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-lifewood-darkSerpent/10 bg-black shadow-[0_20px_40px_rgba(0,0,0,0.18)] animate-[fadeUp_850ms_ease-out]">
          <img
            src="https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=2200&h=1200&fit=crop&dpr=2"
            alt="Careers hero"
            className="h-[300px] w-full object-cover md:h-[460px] animate-[mediaFloat_16s_ease-in-out_infinite]"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-4 animate-[fadeUp_900ms_ease-out]">
            <h2 className="text-2xl font-semibold text-lifewood-darkSerpent">Our Culture</h2>
            <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/74">
              We value integrity, speed, and thoughtful communication. Teams are encouraged to own outcomes, share
              knowledge, and keep improving systems and quality standards.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pillars.map((item, index) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm animate-[fadeUp_1s_ease-out]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-base font-bold text-lifewood-darkSerpent">{item.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-lifewood-darkSerpent/74">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-[28px] border border-lifewood-darkSerpent/10 bg-white p-6 shadow-sm animate-[fadeUp_1.05s_ease-out] md:p-8">
          <h3 className="text-2xl font-semibold text-lifewood-darkSerpent">Open Functions</h3>
          <p className="mt-2 text-sm text-lifewood-darkSerpent/74">
            We hire across operations, delivery, language services, and AI-enabled production.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-lifewood-darkSerpent/10 bg-lifewood-paper px-3 py-2 text-sm text-lifewood-darkSerpent/88"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mediaFloat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
    </section>
  );
};

export default Careers;
