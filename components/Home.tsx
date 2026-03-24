import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Globe,
  Languages,
  Building2,
  Users,
  Headphones,
  FileText,
  ImageIcon,
  VideoIcon,
} from 'lucide-react';
import { FiSend } from 'react-icons/fi';
import { Page } from '../types';
import VariableProximity from './VariableProximity';
import Masonry from './Masonry';
import Threads from './Threads';
import ScrollReveal from './ScrollReveal';
import SplitText from './SplitText';
import CountUp from './CountUp';
import GradientText from './GradientText';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
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

const masonryItems = [
  {
    id: 'ms-1',
    img: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 520,
    label: 'AI-powered data annotation at scale',
  },
  {
    id: 'ms-2',
    img: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800',
    height: 340,
    label: 'Global delivery operations',
  },
  {
    id: 'ms-3',
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 600,
    label: 'Multilingual data processing',
  },
  {
    id: 'ms-4',
    img: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 380,
    label: 'Cross-functional AI teams',
  },
  {
    id: 'ms-5',
    img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 440,
    label: 'Machine learning infrastructure',
  },
  {
    id: 'ms-6',
    img: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 360,
    label: 'Community-driven workforce',
  },
  {
    id: 'ms-7',
    img: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 500,
    label: 'Real-time quality assurance',
  },
  {
    id: 'ms-8',
    img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    height: 320,
    label: 'Inclusive growth worldwide',
  },
];

const serviceCards = [
  {
    title: 'Audio',
    tag: 'Audio Intelligence',
    description:
      'Speech and audio collection, labeling, voice profiling, music taxonomy, and AI-ready conversational support datasets.',
    image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    icon: Headphones,
  },
  {
    title: 'Text',
    tag: 'NLP & Language',
    description:
      'Text collection, transcription, utterance capture, and sentiment annotation optimized for NLP and LLM workflows.',
    image: 'https://images.pexels.com/photos/5402677/pexels-photo-5402677.jpeg?auto=compress&cs=tinysrgb&w=900&h=1400&dpr=2',
    icon: FileText,
  },
  {
    title: 'Image',
    tag: 'Computer Vision',
    description:
      'Image collection and annotation pipelines for classification, object detection, tagging, and production-level quality audits.',
    image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
    icon: ImageIcon,
  },
  {
    title: 'Video',
    tag: 'Multimodal AI',
    description:
      'Video dataset collection, frame-level labeling, stream review, and subtitle generation for robust multimodal AI training.',
    image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
    icon: VideoIcon,
  },
];

/* ── 3D Tilt + Spotlight Card ── */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spot = spotlightRef.current;
    if (!card || !spot) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      spot.style.opacity = '1';
      spot.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,179,71,0.12), transparent 50%)`;
    });
  }, []);

  const handleLeave = useCallback(() => {
    const card = cardRef.current;
    const spot = spotlightRef.current;
    if (card) card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    if (spot) spot.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08]" />
      {children}
    </div>
  );
};

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

const metricCards = [
  {
    value: '40+',
    title: 'Global Delivery Centers',
    description:
      'Lifewood operates 40+ delivery centers to support high-accuracy AI data services with local operational leadership, quality control, and around-the-clock production support.',
    icon: Building2,
    accent: 'from-emerald-500/20 to-emerald-900/5',
  },
  {
    value: '30+',
    title: 'Countries Across All Continents',
    description:
      'Lifewood\u2019s global footprint spans 30+ countries and 40+ centers, including extensive operations in Africa, Asia, Europe, and the Americas, enabling region-specific datasets that reflect cultural and linguistic diversity.',
    icon: Globe,
    accent: 'from-amber-500/20 to-amber-900/5',
  },
  {
    value: '50+',
    title: 'Language Capabilities and Dialects',
    description:
      'Our multilingual teams process speech, text, and localization workflows across more than 50 languages and dialects, helping models perform reliably across diverse user populations.',
    icon: Languages,
    accent: 'from-sky-500/20 to-sky-900/5',
  },
  {
    value: '56,000+',
    title: 'Global Online Resources',
    description:
      'With 56,788 online specialists worldwide, Lifewood mobilizes a flexible workforce for scalable data collection, annotation, and quality assurance, operating 24/7 across regions.',
    icon: Users,
    accent: 'from-violet-500/20 to-violet-900/5',
  },
];

const serviceStats = [
  { value: 200, suffix: '+', label: 'AI Data Projects' },
  { value: 50, suffix: '+', label: 'Languages' },
  { value: 30, suffix: '+', label: 'Countries' },
  { value: 56000, suffix: '+', label: 'Online Resources', separator: ',' },
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const heroTitleLineOneRef = useRef<HTMLDivElement>(null);
  const heroTitleLineTwoRef = useRef<HTMLDivElement>(null);
  const heroTitleLineThreeRef = useRef<HTMLDivElement>(null);
  const homeStats = [
    { value: '56,788', label: 'ONLINE RESOURCES' },
    { value: '30+', label: 'COUNTRIES' },
    { value: '40+', label: 'DELIVERY CENTERS' },
  ];

  return (
    <div className="text-lifewood-darkSerpent">
      {/* ─── HERO (KEPT) ─── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-transparent text-lifewood-paper md:min-h-[100dvh]">
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

      {/* ─── STATS BAR ─── */}
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

      {/* ─── ABOUT + MASONRY SHOWCASE ─── */}
      <section className="bg-lifewood-paper">
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-lifewood-castleton md:text-base">About Us</p>
                <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                  Transforming data into meaningful global solutions.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-lifewood-darkSerpent/75">
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
              <div className="grid grid-cols-2 gap-4">
                {metricCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <RevealOnScroll key={card.title} delay={i * 100}>
                      <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.accent} border border-lifewood-darkSerpent/8 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                        <Icon className="mb-3 h-6 w-6 text-lifewood-castleton/70" />
                        <p className="text-3xl font-extrabold text-lifewood-darkSerpent">{card.value}</p>
                        <p className="mt-1 text-sm font-semibold text-lifewood-darkSerpent/85">{card.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-lifewood-darkSerpent/60">{card.description}</p>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.22em] text-lifewood-castleton/70">What We Do</p>
            <h3 className="mb-10 text-center text-2xl font-bold text-lifewood-darkSerpent md:text-3xl">
              By connecting local expertise with our global AI data infrastructure, we create opportunities, empower communities, and drive inclusive growth worldwide.
            </h3>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <Masonry
              items={masonryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
              colorShiftOnHover={false}
            />
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── CLIENTS & PARTNERS (KEPT) ─── */}
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
                        `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='40'><rect width='100%' height='100%' fill='transparent'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#4B5563' font-family='Manrope, sans-serif' font-size='14' font-weight='700'>${partner.name}</text></svg>`
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

      {/* ─── AI DATA SERVICES (GRAND REDESIGN) ─── */}
      <section className="relative overflow-hidden bg-[#0a0f0d] py-28">
        {/* Threads shader background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]">
          <Threads
            color={[0.016, 0.384, 0.255]}
            amplitude={0.4}
            distance={0.8}
            enableMouseInteraction={false}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ScrollReveal headline */}
          <div className="mb-6 text-center">
            <ScrollReveal
              enableBlur
              baseOpacity={0.1}
              baseRotation={3}
              blurStrength={4}
              textClassName="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white"
            >
              AI Data Services
            </ScrollReveal>
          </div>

          {/* SplitText subtitle */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <SplitText
              text="Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance."
              className="text-base md:text-lg leading-relaxed text-white/60"
              delay={0.03}
              duration={0.5}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              textAlign="center"
            />
          </div>

          {/* Service cards — 3D tilt + spotlight */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {serviceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <TiltCard key={card.title} delay={i * 120}>
                  <div className="relative h-full">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-48 w-full object-cover sm:h-52"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur-md">
                      <Icon className="h-3.5 w-3.5 text-lifewood-saffron" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
                        {card.tag}
                      </span>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white">{card.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{card.description}</p>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>

          {/* CountUp stat counters */}
          <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
            {serviceStats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-lifewood-saffron md:text-5xl">
                  <CountUp to={stat.value} duration={0.8} separator={stat.separator || ''} delay={i * 0.08} />
                  <span>{stat.suffix}</span>
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* GradientText CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={() => onNavigate(Page.SERVICES)}
              className="group inline-flex items-center gap-3"
            >
              <GradientText
                className="text-2xl font-bold md:text-3xl"
                colors={['#046241', '#FFB347', '#FFC370', '#046241']}
                animationSpeed={6}
                direction="horizontal"
              >
                Explore Our Services
              </GradientText>
              <ArrowRight className="h-6 w-6 text-lifewood-saffron transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
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
