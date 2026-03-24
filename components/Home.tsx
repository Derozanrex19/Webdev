import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowRight,
  Globe,
  Languages,
  Building2,
  Users,
} from 'lucide-react';
import { FiSend } from 'react-icons/fi';
import { Page } from '../types';
import VariableProximity from './VariableProximity';
import Masonry from './Masonry';
import Threads from './Threads';
import CountUp from './CountUp';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

/* ── GPU-accelerated parallax hook ── */
interface UseParallaxOptions {
  speed?: number;        // multiplier: negative = opposite to scroll, positive = same direction
  direction?: 'y' | 'x';
  start?: string;        // ScrollTrigger start
  end?: string;          // ScrollTrigger end
  scrub?: number | boolean;
  opacityFade?: boolean; // fade out as it scrolls away
  scale?: { from: number; to: number };
}

function useParallax<T extends HTMLElement = HTMLDivElement>(options: UseParallaxOptions = {}) {
  const ref = useRef<T>(null);
  const {
    speed = -50,
    direction = 'y',
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    opacityFade = false,
    scale,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.willChange = 'transform';

    const props: gsap.TweenVars = {
      [direction]: speed,
      ease: 'none',
      ...(opacityFade && { opacity: 0 }),
      ...(scale && { scale: scale.to }),
    };

    const fromProps: gsap.TweenVars | undefined = scale ? { scale: scale.from } : undefined;

    const tween = fromProps
      ? gsap.fromTo(el, fromProps, {
          ...props,
          scrollTrigger: { trigger: el, start, end, scrub },
        })
      : gsap.to(el, {
          ...props,
          scrollTrigger: { trigger: el, start, end, scrub },
        });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, direction, start, end, scrub, opacityFade, scale]);

  return ref;
}

/* ── Declarative parallax wrapper ── */
interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'y' | 'x';
  opacityFade?: boolean;
  scale?: { from: number; to: number };
  start?: string;
  end?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  speed = -50,
  direction = 'y',
  opacityFade = false,
  scale,
  start,
  end,
  tag: Tag = 'div',
}) => {
  const ref = useParallax<HTMLDivElement>({ speed, direction, opacityFade, scale, start, end });
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
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

/* ═══════════════════════════════════════════════════════════════════════
   APPLE-STYLE PINNED SCROLL EXPERIENCE — AI DATA SERVICES
   ═══════════════════════════════════════════════════════════════════════ */

const appleFeatures = [
  {
    title: 'Audio',
    tag: 'Audio Intelligence',
    description:
      'Speech and audio collection, labeling, voice profiling, music taxonomy, and AI-ready conversational support datasets.',
    image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2',
    stat: { value: 200, suffix: '+', label: 'Audio Projects Delivered' },
    accent: '#FFB347',
  },
  {
    title: 'Text',
    tag: 'NLP & Language',
    description:
      'Text collection, transcription, utterance capture, and sentiment annotation optimized for NLP and LLM workflows.',
    image: 'https://images.pexels.com/photos/5402677/pexels-photo-5402677.jpeg?auto=compress&cs=tinysrgb&w=900&h=1400&dpr=2',
    stat: { value: 50, suffix: '+', label: 'Languages Supported' },
    accent: '#FFC370',
  },
  {
    title: 'Image',
    tag: 'Computer Vision',
    description:
      'Image collection and annotation pipelines for classification, object detection, tagging, and production-level quality audits.',
    image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
    stat: { value: 30, suffix: '+', label: 'Countries Active' },
    accent: '#046241',
  },
  {
    title: 'Video',
    tag: 'Multimodal AI',
    description:
      'Video dataset collection, frame-level labeling, stream review, and subtitle generation for robust multimodal AI training.',
    image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&dpr=2',
    stat: { value: 56000, suffix: '+', label: 'Online Resources', separator: ',' },
    accent: '#FFB347',
  },
];

const AppleServicesSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  const setFeatureRef = useCallback((el: HTMLDivElement | null, i: number) => {
    featureRefs.current[i] = el;
  }, []);
  const setImageRef = useCallback((el: HTMLDivElement | null, i: number) => {
    imageRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const headline = headlineRef.current;
    const statsRow = statsRowRef.current;
    const progress = progressRef.current;
    if (!section || !pinned || !headline || !statsRow || !progress) return;

    const featureCount = appleFeatures.length;
    const ctx = gsap.context(() => {
      /* ── Force all layers invisible at start ── */
      gsap.set(headline, { opacity: 0, scale: 0.3, filter: 'blur(20px)', visibility: 'visible' });
      gsap.set(statsRow, { opacity: 0, y: 60, visibility: 'hidden' });
      featureRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 80, visibility: 'hidden' });
      });
      imageRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 1.15, visibility: 'hidden' });
      });

      /* Master timeline pinned for the entire section scroll */
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${window.innerHeight * (featureCount + 3)}`,
          pin: pinned,
          scrub: 1,
          onUpdate: (self) => {
            if (progress) {
              progress.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      /* ── Phase 1: Headline zoom-in (Apple MacBook Air style) ── */
      master.to(
        headline,
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
        0
      );

      /* ── Phase 2: Fade headline out before features ── */
      master.to(
        headline,
        { opacity: 0, y: -80, scale: 1.08, visibility: 'hidden', duration: 0.5 },
        1.2
      );

      /* ── Phase 3: Feature-by-feature reveal with cross-fade ── */
      featureRefs.current.forEach((featureEl, i) => {
        const imageEl = imageRefs.current[i];
        if (!featureEl || !imageEl) return;

        const featureStart = 1.8 + i * 1.5;

        master.to(
          imageEl,
          { scale: 1, opacity: 1, visibility: 'visible', duration: 0.6, ease: 'power2.out' },
          featureStart
        );

        master.to(
          featureEl,
          {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => setActiveFeature(i),
          },
          featureStart + 0.15
        );

        if (i < featureCount - 1) {
          master.to(
            featureEl,
            { y: -60, opacity: 0, visibility: 'hidden', duration: 0.4, ease: 'power2.in' },
            featureStart + 1.1
          );
          master.to(
            imageEl,
            { scale: 0.95, opacity: 0, visibility: 'hidden', duration: 0.4, ease: 'power2.in' },
            featureStart + 1.0
          );
        }
      });

      /* ── Phase 4: Last feature fades, stats sweep in ── */
      const statsStart = 1.8 + (featureCount - 1) * 1.5 + 1.3;

      const lastFeature = featureRefs.current[featureCount - 1];
      const lastImage = imageRefs.current[featureCount - 1];
      if (lastFeature) {
        master.to(lastFeature, { y: -60, opacity: 0, visibility: 'hidden', duration: 0.4 }, statsStart - 0.3);
      }
      if (lastImage) {
        master.to(lastImage, { scale: 0.95, opacity: 0, visibility: 'hidden', duration: 0.4 }, statsStart - 0.4);
      }

      master.to(
        statsRow,
        {
          y: 0,
          opacity: 1,
          visibility: 'visible',
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => setStatsVisible(true),
        },
        statsStart
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0f0d]">
      {/* Scroll progress bar at top of viewport */}
      <div className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full origin-left" style={{ opacity: 0 }} ref={(el) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([e]) => { el.style.opacity = e.isIntersecting ? '1' : '0'; },
          { threshold: 0.01 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
      }}>
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gradient-to-r from-lifewood-castleton via-lifewood-saffron to-lifewood-earth"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div ref={pinnedRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Threads shader — always behind everything */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.25]">
          <Threads
            color={[0.016, 0.384, 0.255]}
            amplitude={0.4}
            distance={0.8}
            enableMouseInteraction={false}
          />
        </div>

        {/* Feature background images — absolutely positioned, cross-fade */}
        {appleFeatures.map((feature, i) => (
          <div
            key={`img-${feature.title}`}
            ref={(el) => setImageRef(el, i)}
            className="absolute inset-0 z-[1]"
            style={{ visibility: 'hidden', willChange: 'transform, opacity' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/70 to-transparent z-10" />
            <img
              src={feature.image}
              alt={feature.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        ))}

        {/* ── Content layer ── */}
        <div className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Headline — zooms in Apple-style */}
          <div
            ref={headlineRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            style={{ willChange: 'transform, opacity, filter', visibility: 'hidden' }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-lifewood-saffron/80 md:text-sm">
              AI Data Services
            </p>
            <h2 className="text-center text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-8xl lg:text-9xl">
              Engineering
              <br />
              <span className="bg-gradient-to-r from-lifewood-saffron via-lifewood-earth to-lifewood-saffron bg-clip-text text-transparent">
                Intelligence.
              </span>
            </h2>
          </div>

          {/* Feature cards — one at a time, centered */}
          {appleFeatures.map((feature, i) => (
            <div
              key={`feat-${feature.title}`}
              ref={(el) => setFeatureRef(el, i)}
              className="pointer-events-none absolute inset-0 flex items-end justify-start pb-[8vh] pl-2 sm:pl-4 md:pb-[10vh] md:pl-0"
              style={{ visibility: 'hidden', willChange: 'transform, opacity' }}
            >
              <div className="max-w-lg">
                <span
                  className="mb-3 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ borderColor: `${feature.accent}40`, color: feature.accent }}
                >
                  {feature.tag}
                </span>
                <h3 className="text-4xl font-extrabold text-white md:text-6xl lg:text-7xl">
                  {feature.title}<span className="text-lifewood-saffron">.</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base lg:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}

          {/* Stats row */}
          <div
            ref={statsRowRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ visibility: 'hidden', willChange: 'transform, opacity' }}
          >
            <div className="grid w-full max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {serviceStats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-extrabold text-lifewood-saffron md:text-5xl">
                    {statsVisible ? (
                      <CountUp to={stat.value} duration={1} separator={stat.separator || ''} delay={i * 0.12} />
                    ) : '0'}
                    <span>{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Feature navigation dots */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2">
          {appleFeatures.map((feature, i) => (
            <div
              key={`dot-${feature.title}`}
              className="flex items-center gap-2 transition-all duration-500"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  activeFeature === i
                    ? 'h-8 w-1.5 bg-lifewood-saffron'
                    : 'h-3 w-1.5 bg-white/25'
                }`}
              />
              <span
                className={`hidden text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 md:block ${
                  activeFeature === i ? 'text-white/80' : 'text-transparent'
                }`}
              >
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const heroTitleLineOneRef = useRef<HTMLDivElement>(null);
  const heroTitleLineTwoRef = useRef<HTMLDivElement>(null);
  const heroTitleLineThreeRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const homeStats = [
    { value: '56,788', label: 'ONLINE RESOURCES' },
    { value: '30+', label: 'COUNTRIES' },
    { value: '40+', label: 'DELIVERY CENTERS' },
  ];

  /* ── Hero parallax: text floats up faster, CTA drifts slightly ── */
  useEffect(() => {
    const hero = heroSectionRef.current;
    if (!hero) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      tl.to('.hero-title', { y: -120, ease: 'none' }, 0);
      tl.to('.hero-cta', { y: -40, opacity: 0.3, ease: 'none' }, 0);
    }, hero);
    return () => ctx.revert();
  }, []);

  return (
    <div className="text-lifewood-darkSerpent">
      {/* ─── HERO (KEPT) ─── */}
      <section ref={heroSectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden bg-transparent text-lifewood-paper md:min-h-[100dvh]">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="hero-title relative" style={{ willChange: 'transform' }}>
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
            <div className="hero-cta mt-10 flex flex-col items-center gap-4" style={{ willChange: 'transform, opacity' }}>
              <button
                onClick={() => onNavigate(Page.CONTACT)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-seasalt"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate(Page.SERVICES)}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-lifewood-saffron"
              >
                Explore Our Services <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="overflow-hidden border-y border-white/15 bg-[#2b6c46]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {homeStats.map((stat, index) => (
            <ParallaxLayer
              key={stat.label}
              speed={15 + index * 8}
              direction="y"
              tag="article"
              className={`group relative px-8 py-10 text-center transition-all duration-300 hover:bg-white/5 ${
                index < homeStats.length - 1 ? 'sm:border-r sm:border-white/20' : ''
              }`}
            >
              <div className="mx-auto w-fit">
                <span className="text-5xl font-extrabold leading-none tracking-tight text-lifewood-saffron">{stat.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium tracking-[0.15em] text-white/85">{stat.label}</p>
            </ParallaxLayer>
          ))}
        </div>
      </section>

      {/* ─── ABOUT + MASONRY SHOWCASE ─── */}
      <section className="bg-lifewood-paper">
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
              <ParallaxLayer speed={-30} className="will-change-transform">
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
              </ParallaxLayer>
              <div className="grid grid-cols-2 gap-4">
                {metricCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <ParallaxLayer key={card.title} speed={-15 - i * 10}>
                      <RevealOnScroll delay={i * 100}>
                        <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.accent} border border-lifewood-darkSerpent/8 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                          <Icon className="mb-3 h-6 w-6 text-lifewood-castleton/70" />
                          <p className="text-3xl font-extrabold text-lifewood-darkSerpent">{card.value}</p>
                          <p className="mt-1 text-sm font-semibold text-lifewood-darkSerpent/85">{card.title}</p>
                          <p className="mt-2 text-xs leading-relaxed text-lifewood-darkSerpent/60">{card.description}</p>
                        </div>
                      </RevealOnScroll>
                    </ParallaxLayer>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <ParallaxLayer speed={-20}>
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.22em] text-lifewood-castleton/70">What We Do</p>
              <h3 className="mb-10 text-center text-2xl font-bold text-lifewood-darkSerpent md:text-3xl">
                By connecting local expertise with our global AI data infrastructure, we create opportunities, empower communities, and drive inclusive growth worldwide.
              </h3>
            </ParallaxLayer>
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
            <ParallaxLayer speed={-15}>
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
            </ParallaxLayer>
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

      {/* ─── AI DATA SERVICES — APPLE-STYLE SCROLL EXPERIENCE ─── */}
      <AppleServicesSection onNavigate={onNavigate} />

      {/* ─── CTA FOOTER ─── */}
      <section className="overflow-hidden bg-lifewood-darkSerpent py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <ParallaxLayer speed={-20}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Global Data Engineering</p>
            <h2 className="mt-3 text-3xl font-bold text-white">We provide global Data Engineering Services to enable AI solutions.</h2>
          </ParallaxLayer>
          <ParallaxLayer speed={-10}>
            <button
              onClick={() => onNavigate(Page.CONTACT)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lifewood-saffron px-7 py-3 font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </button>
          </ParallaxLayer>
        </div>
      </section>
    </div>
  );
};

export default Home;
