import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Database,
} from 'lucide-react';
import { Page } from '../types';
import Threads from './Threads';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface MetricAccordionItem {
  title: string;
  value: string;
  description: string;
  image: string;
  cardClasses: string;
  titleClasses: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const metricAccordionItems: MetricAccordionItem[] = [
  {
    value: '40+',
    title: 'Global Delivery Centers',
    description:
      'Lifewood operates 40+ delivery centers to support high-accuracy AI data services with local operational leadership, quality control, and around-the-clock production support.',
    image:
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
    cardClasses: 'bg-[#f2edd8]',
    titleClasses: 'text-[#0f1218]',
  },
  {
    value: '30+',
    title: 'Countries Across All Continents',
    description:
      'Lifewood\u2019s global footprint spans 30+ countries and 40+ centers, including extensive operations in Africa, Asia, Europe, and the Americas, enabling region-specific datasets that reflect cultural and linguistic diversity.',
    image:
      'https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
    cardClasses: 'bg-[#f1be74]',
    titleClasses: 'text-[#0f1218]',
  },
  {
    value: '50+',
    title: 'Language Capabilities and Dialects',
    description:
      'Our multilingual teams process speech, text, and localization workflows across more than 50 languages and dialects, helping models perform reliably across diverse user populations.',
    image:
      'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
    cardClasses: 'bg-[#1f573b]',
    titleClasses: 'text-white',
  },
  {
    value: '56,000+',
    title: 'Global Online Resources',
    description:
      'With 56,788 online specialists worldwide, Lifewood mobilizes a flexible workforce for scalable data collection, annotation, and quality assurance, operating 24/7 across regions.',
    image:
      'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
    cardClasses: 'bg-[#02040b]',
    titleClasses: 'text-white',
  },
];

const services = [
  {
    title: 'Audio',
    description: 'Collection, labelling, voice categorization, music categorization, intelligent cs',
    image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
  },
  {
    title: 'Image',
    description: 'Collection, labelling, classification, audit, object detection and tagging',
    image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
  },
  {
    title: 'Video',
    description: 'Collection, labelling, audit, live broadcast, subtitle generation',
    image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
  },
  {
    title: 'Text',
    description: 'Text collection, labelling, transcription, utterance collection, sentiment analysis',
    image: 'https://images.pexels.com/photos/5402677/pexels-photo-5402677.jpeg?auto=compress&cs=tinysrgb&w=900&h=1400&dpr=2',
  },
];

const partners = [
  { name: 'Moore Foundation', logo: 'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png' },
  { name: 'Google', logo: 'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png' },
  { name: 'BYU Pathway Worldwide', logo: 'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png' },
  { name: 'FamilySearch', logo: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png' },
  { name: 'ancestry', logo: 'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png' },
  { name: 'Apple', logo: 'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png' },
  { name: 'Microsoft', logo: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png' },
];
const marqueePartners = [...partners, ...partners, ...partners];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [openMetricIndex, setOpenMetricIndex] = useState(3);
  const homeStats = [
    { value: '56,788', label: 'ONLINE RESOURCES' },
    { value: '30+', label: 'COUNTRIES' },
    { value: '40+', label: 'DELIVERY CENTERS' },
  ];

  return (
    <div className="bg-lifewood-paper text-lifewood-darkSerpent">
      <section className="relative flex min-h-[calc(100vh-96px)] items-center overflow-hidden bg-lifewood-darkSerpent text-lifewood-paper">
        <div className="absolute inset-0">
          <Threads
            color={[1, 0.70196, 0.27843]}
            amplitude={1.05}
            distance={0.85}
            enableMouseInteraction
          />
          <Threads
            color={[1, 0.70196, 0.27843]}
            amplitude={0.55}
            distance={1.35}
            enableMouseInteraction={false}
            className="absolute inset-0 opacity-50"
          />
          <div className="absolute inset-0 bg-lifewood-darkSerpent/52"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_28%,rgba(255,179,71,0.18),transparent_55%)] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-lifewood-saffron">AI Data Solutions</p>
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-7xl">
              The world&apos;s leading provider of AI-powered data solutions.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base text-lifewood-grey-light/90 md:text-2xl md:leading-relaxed">
              We connect local expertise with global AI data infrastructure to help organizations launch new ways of
              thinking, learning, and doing.
            </p>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => onNavigate(Page.CONTACT)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-seasalt"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/15 bg-[#2b6c46]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {homeStats.map((stat, index) => (
            <article
              key={stat.label}
              className={`group relative px-8 py-10 text-center transition-all duration-300 hover:bg-white/5 ${
                index < homeStats.length - 1 ? 'sm:border-r sm:border-white/20' : ''
              }`}
            >
              <div className="mx-auto w-fit">
                <span className="text-5xl font-extrabold leading-none tracking-tight text-lifewood-saffron">{stat.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium tracking-[0.15em] text-white/85">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lifewood-castleton">About Us</p>
            <h2 className="text-3xl font-bold md:text-4xl">Transforming data into meaningful global solutions.</h2>
            <p className="mt-5 text-lifewood-darkSerpent/75">
              At Lifewood we empower our company and clients to realize the transformative potential of AI. By connecting
              local talent with global infrastructure, we create opportunities and drive inclusive growth.
            </p>
          </div>
        </RevealOnScroll>
        <div className="space-y-3">
          {metricAccordionItems.map((item, index) => {
            const isOpen = openMetricIndex === index;
            return (
              <RevealOnScroll key={item.title} delay={index * 110}>
                <article
                  onMouseEnter={() => setOpenMetricIndex(index)}
                  onFocusCapture={() => setOpenMetricIndex(index)}
                  className={`overflow-hidden rounded-2xl ${item.cardClasses} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'shadow-2xl' : 'shadow-md'
                  }`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setOpenMetricIndex(index);
                      }
                    }}
                    className="flex w-full cursor-default items-center justify-between gap-3 px-4 py-3.5 text-left md:px-5 md:py-4"
                  >
                    <h3 className={`text-[1.8rem] font-medium leading-[1.15] md:text-[2.1rem] ${item.titleClasses}`}>
                      <span className="mr-2">{item.value}</span>
                      {item.title}
                    </h3>
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl font-medium text-lifewood-darkSerpent transition-transform duration-500 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      {isOpen ? '\u2212' : '+'}
                    </span>
                  </div>

                  <div
                    className={`grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`grid grid-cols-1 gap-4 px-4 pb-4 pt-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-12 md:gap-6 md:px-5 md:pb-5 ${
                          isOpen ? 'translate-y-0' : 'translate-y-2'
                        }`}
                      >
                        <div className="md:col-span-5 lg:col-span-4">
                          <div className="relative h-36 overflow-hidden rounded-xl md:h-44">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                        </div>
                        <div className="md:col-span-7 lg:col-span-8 md:flex md:items-center">
                          <p
                            className={`max-w-3xl text-[0.95rem] leading-[1.65] ${
                              item.titleClasses === 'text-white' ? 'text-white/85' : 'text-[#0f1218]/80'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      <section className="bg-lifewood-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <p className="text-center text-2xl font-extrabold uppercase tracking-[0.14em] text-lifewood-darkSerpent md:text-4xl">
              <span className="inline-block transition-transform duration-500 hover:scale-[1.02]">
                Our Clients And Partners
              </span>
            </p>
          </RevealOnScroll>
          <div className="marquee-wrap mt-6 overflow-hidden bg-transparent py-8 md:py-12">
            <div className="marquee-track flex w-max items-center gap-2 md:gap-4 px-2 md:px-4">
              {marqueePartners.map((partner, index) => (
                <span
                  key={`${partner.name}-${index}`}
                  className="flex h-44 min-w-[250px] md:h-72 md:min-w-[460px] items-center justify-center bg-transparent px-1"
                >
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    onError={(event) => {
                      const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='40'><rect width='100%' height='100%' fill='transparent'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#4B5563' font-family='Arial, sans-serif' font-size='14' font-weight='700'>${partner.name}</text></svg>`
                      )}`;
                      event.currentTarget.src = fallback;
                    }}
                    className="h-28 md:h-52 w-auto max-w-[280px] md:max-w-[500px] object-contain transition-transform duration-300 hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 12px 22px rgba(19,48,32,0.14))',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-10 flex items-center gap-3">
            <Database className="h-6 w-6 text-lifewood-castleton" />
            <h2 className="text-3xl font-bold uppercase md:text-4xl">AI Data Services</h2>
          </div>
          <p className="mb-10 max-w-3xl text-lifewood-darkSerpent/75">
            Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to
            optimize organizational performance.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={60}>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12 md:grid-rows-[220px_160px]">
            <article className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-9 md:row-span-1">
              <img
                src={services[0].image}
                alt="Audio data services"
                className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/78 via-lifewood-darkSerpent/30 to-lifewood-darkSerpent/18"></div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-medium text-white">Audio</h3>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-lifewood-darkSerpent/78 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="max-w-xl text-[11px] leading-snug text-white">
                  {services[0].description}
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-3 md:row-span-2">
              <img
                src={services[3].image}
                alt="Text data services"
                className="h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/65 via-lifewood-darkSerpent/25 to-lifewood-darkSerpent/10"></div>
              <h3 className="absolute left-3 top-2 text-sm font-medium text-white">Text</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-lifewood-darkSerpent/78 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-[11px] leading-snug text-white">
                  {services[3].description}
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-3 md:row-span-1">
              <img
                src={services[1].image}
                alt="Image data services"
                className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/62 via-lifewood-darkSerpent/22 to-transparent"></div>
              <h3 className="absolute left-3 top-2 text-sm font-medium text-white">Image</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-lifewood-darkSerpent/78 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-[11px] leading-snug text-white">
                  {services[1].description}
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-6 md:row-span-1">
              <img
                src={services[2].image}
                alt="Video data services"
                className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/62 via-lifewood-darkSerpent/22 to-transparent"></div>
              <h3 className="absolute left-3 top-2 text-sm font-medium text-white">Video</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-lifewood-darkSerpent/78 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-[11px] leading-snug text-white">
                  {services[2].description}
                </p>
              </div>
            </article>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-lifewood-darkSerpent py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Global Data Engineering</p>
            <h2 className="mt-3 text-3xl font-bold text-white">We provide global Data Engineering Services to enable AI solutions.</h2>
          </div>
          <button
            onClick={() => onNavigate(Page.CONTACT)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lifewood-saffron px-7 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
          >
            Contact Us <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
