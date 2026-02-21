import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Database,
} from 'lucide-react';
import { FiSend } from 'react-icons/fi';
import { Page } from '../types';
import FloatingLines from './FloatingLines';
import VariableProximity from './VariableProximity';
import GlareHover from './GlareHover';

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
    description:
      'Speech and audio collection, labeling, voice profiling, music taxonomy, and AI-ready conversational support datasets.',
    image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
  },
  {
    title: 'Image',
    description:
      'Image collection and annotation pipelines for classification, object detection, tagging, and production-level quality audits.',
    image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
  },
  {
    title: 'Video',
    description:
      'Video dataset collection, frame-level labeling, stream review, and subtitle generation for robust multimodal AI training.',
    image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
  },
  {
    title: 'Text',
    description:
      'Text collection, transcription, utterance capture, and sentiment annotation optimized for NLP and LLM workflows.',
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
  const heroTitleLineOneRef = useRef<HTMLDivElement>(null);
  const heroTitleLineTwoRef = useRef<HTMLDivElement>(null);
  const heroTitleLineThreeRef = useRef<HTMLDivElement>(null);
  const homeStats = [
    { value: '56,788', label: 'ONLINE RESOURCES' },
    { value: '30+', label: 'COUNTRIES' },
    { value: '40+', label: 'DELIVERY CENTERS' },
  ];

  return (
    <div className="bg-lifewood-paper text-lifewood-darkSerpent">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-lifewood-darkSerpent text-lifewood-paper md:min-h-[100dvh]">
        <div className="absolute inset-0">
          <FloatingLines
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[4, 6, 5]}
            lineDistance={[4.6, 5.2, 4.2]}
            bendRadius={4.4}
            bendStrength={-0.42}
            interactive={true}
            parallax={true}
            parallaxStrength={0.12}
            animationSpeed={0.78}
            linesGradient={['#0e5f3d', '#1f7a4f', '#ffb347', '#f4d0a4']}
            topWavePosition={{ x: 8.8, y: 0.55, rotate: -0.38 }}
            middleWavePosition={{ x: 4.4, y: -0.02, rotate: 0.18 }}
            bottomWavePosition={{ x: 1.6, y: -0.66, rotate: 0.34 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_34%,rgba(255,179,71,0.19),transparent_52%)] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,18,0.36)_0%,rgba(8,27,19,0.52)_58%,rgba(8,27,19,0.72)_100%)]"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-lifewood-darkSerpent"></div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative">
              <h1 className="mx-auto hidden max-w-5xl text-4xl font-extrabold leading-tight text-white md:block md:text-7xl">
                <div ref={heroTitleLineOneRef}>
                  <VariableProximity
                    label="The world's leading provider"
                    className="variable-proximity-demo"
                    fromFontVariationSettings="'wght' 700"
                    toFontVariationSettings="'wght' 1000"
                    containerRef={heroTitleLineOneRef}
                    radius={95}
                    falloff="exponential"
                  />
                </div>
                <div ref={heroTitleLineTwoRef}>
                  <VariableProximity
                    label="of AI-powered data"
                    className="variable-proximity-demo"
                    fromFontVariationSettings="'wght' 700"
                    toFontVariationSettings="'wght' 1000"
                    containerRef={heroTitleLineTwoRef}
                    radius={95}
                    falloff="exponential"
                  />
                </div>
                <div ref={heroTitleLineThreeRef}>
                  <VariableProximity
                    label="solutions."
                    className="variable-proximity-demo"
                    fromFontVariationSettings="'wght' 700"
                    toFontVariationSettings="'wght' 1000"
                    containerRef={heroTitleLineThreeRef}
                    radius={95}
                    falloff="exponential"
                  />
                </div>
              </h1>
              <h1 className="mx-auto max-w-5xl text-4xl font-extrabold leading-tight text-white md:hidden">
                The world&apos;s leading provider of AI-powered data solutions.
              </h1>
            </div>
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
          <div className="mb-12 mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-lifewood-castleton md:text-base">About Us</p>
            <h2 className="text-3xl font-bold md:text-4xl">Transforming data into meaningful global solutions.</h2>
            <p className="mt-5 text-lifewood-darkSerpent/75 md:text-lg">
              At Lifewood we empower our company and clients to realize the transformative potential of AI. By connecting
              local talent with global infrastructure, we create opportunities and drive inclusive growth.
            </p>
            <div className="mt-8">
              <button
                onClick={() => onNavigate(Page.ABOUT)}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-lifewood-paper px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-lifewood-castleton shadow-[-5px_-5px_10px_rgba(255,255,255,0.9),5px_5px_12px_rgba(19,48,32,0.22)] transition-all duration-300 hover:scale-[1.02] hover:border-lifewood-castleton/35 hover:text-lifewood-darkSerpent hover:shadow-[-1px_-1px_6px_rgba(255,255,255,0.7),1px_1px_8px_rgba(19,48,32,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.95),inset_2px_2px_5px_rgba(19,48,32,0.2)] active:scale-[0.98]"
              >
                <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span>Know Us Better</span>
              </button>
            </div>
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
            <p className="mx-auto mt-5 max-w-5xl text-center font-sans text-base leading-relaxed text-lifewood-darkSerpent/75 md:text-xl md:leading-relaxed">
              We are proud to partner and work with leading organizations worldwide in transforming data into meaningful
              solutions. Lifewood&apos;s commitment to innovation and excellence has earned the trust of global brands
              across industries. Here are some of the valued clients and partners we&apos;ve collaborated with:
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
            <GlareHover
              as="article"
              className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-9 md:row-span-1"
              glareColor="#ffffff"
              glareOpacity={0.24}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={820}
              playOnce={false}
            >
              <img
                src={services[0].image}
                alt="Audio data services"
                className="relative z-0 h-full w-full object-cover opacity-80 transition duration-1000 ease-out group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-lifewood-darkSerpent/90 via-lifewood-darkSerpent/38 to-lifewood-darkSerpent/10"></div>
              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 py-3 md:px-4">
                <h3 className="text-base font-bold tracking-wide text-white drop-shadow-sm md:text-lg">Audio</h3>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-2 bg-lifewood-darkSerpent/78 px-3 py-2.5 opacity-0 backdrop-blur-[1.5px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:px-4 md:py-3">
                <p className="max-w-2xl text-xs leading-snug text-white/95 md:text-[13px] md:leading-snug">
                  {services[0].description}
                </p>
              </div>
            </GlareHover>

            <GlareHover
              as="article"
              className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-3 md:row-span-2"
              glareColor="#ffffff"
              glareOpacity={0.24}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={820}
              playOnce={false}
            >
              <img
                src={services[3].image}
                alt="Text data services"
                className="relative z-0 h-full w-full object-cover opacity-82 transition duration-1000 ease-out group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-lifewood-darkSerpent/80 via-lifewood-darkSerpent/35 to-lifewood-darkSerpent/12"></div>
              <h3 className="absolute left-3 top-3 z-20 text-base font-bold tracking-wide text-white drop-shadow-sm md:left-4 md:text-lg">Text</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-2 bg-lifewood-darkSerpent/80 px-3 py-2.5 opacity-0 backdrop-blur-[1.5px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:px-4 md:py-3">
                <p className="text-xs leading-snug text-white/95 md:text-[13px] md:leading-snug">
                  {services[3].description}
                </p>
              </div>
            </GlareHover>

            <GlareHover
              as="article"
              className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-3 md:row-span-1"
              glareColor="#ffffff"
              glareOpacity={0.24}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={820}
              playOnce={false}
            >
              <img
                src={services[1].image}
                alt="Image data services"
                className="relative z-0 h-full w-full object-cover opacity-82 transition duration-1000 ease-out group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-lifewood-darkSerpent/78 via-lifewood-darkSerpent/34 to-transparent"></div>
              <div className="pointer-events-none absolute inset-0 z-[15] bg-lifewood-castleton/24 mix-blend-multiply"></div>
              <h3 className="absolute left-3 top-3 z-20 text-base font-bold tracking-wide text-white drop-shadow-sm md:left-4 md:text-lg">Image</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-2 bg-lifewood-darkSerpent/80 px-3 py-2.5 opacity-0 backdrop-blur-[1.5px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:px-4 md:py-3">
                <p className="text-xs leading-snug text-white/95 md:text-[13px] md:leading-snug">
                  {services[1].description}
                </p>
              </div>
            </GlareHover>

            <GlareHover
              as="article"
              className="group relative overflow-hidden rounded-xl border border-lifewood-darkSerpent/12 bg-lifewood-darkSerpent md:col-span-6 md:row-span-1"
              glareColor="#ffffff"
              glareOpacity={0.24}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={820}
              playOnce={false}
            >
              <img
                src={services[2].image}
                alt="Video data services"
                className="relative z-0 h-full w-full object-cover opacity-82 transition duration-1000 ease-out group-hover:scale-[1.04] group-hover:opacity-95"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-lifewood-darkSerpent/78 via-lifewood-darkSerpent/34 to-transparent"></div>
              <div className="pointer-events-none absolute inset-0 z-[15] bg-lifewood-castleton/24 mix-blend-multiply"></div>
              <h3 className="absolute left-3 top-3 z-20 text-base font-bold tracking-wide text-white drop-shadow-sm md:left-4 md:text-lg">Video</h3>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-2 bg-lifewood-darkSerpent/80 px-3 py-2.5 opacity-0 backdrop-blur-[1.5px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:px-4 md:py-3">
                <p className="text-xs leading-snug text-white/95 md:text-[13px] md:leading-snug">
                  {services[2].description}
                </p>
              </div>
            </GlareHover>
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
