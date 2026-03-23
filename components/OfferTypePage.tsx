import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import VariableProximity from './VariableProximity';
import PixelTransition from './PixelTransition';
import ScrollReveal from './ScrollReveal';
import SplitText from './SplitText';
import Threads from './Threads';
import GradientText from './GradientText';
import CountUp from './CountUp';

type OfferTypeKey = 'A' | 'B' | 'C' | 'D';

interface OfferTypePageProps {
  type: OfferTypeKey;
  onNavigate: (page: Page) => void;
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface OfferContent {
  title: string;
  subtitle: string;
  objective: string;
  features: string[];
  results: string[];
  image: string;
  objectiveImage: string;
  featuresImage: string;
  resultsImage: string;
}

const offerContent: Record<OfferTypeKey, OfferContent> = {
  A: {
    title: 'Type A - Data Servicing',
    subtitle: 'End-to-end data services specializing in multi-language datasets.',
    objective:
      'Scan document for preservation, extract data and structure into database.',
    features: [
      'Auto Crop',
      'Auto De-skew',
      'Blur Detection',
      'Foreign Object Detection',
      'AI Data Extraction',
    ],
    results: [
      'Accurate and precise data is ensured through validation and quality assurance.',
      'The system is efficient and scalable, enabling fast and adaptable data extraction.',
      'It supports multiple languages and formats, allowing the handling of diverse documents.',
      'Advanced features include auto-crop, de-skew, blur, and object detection.',
      'With AI integration, the solution provides structured data for AI tools and delivers clear, visual, and easy-to-understand results.',
    ],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/5716032/pexels-photo-5716032.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
  B: {
    title: 'Type B - Horizontal LLM Data',
    subtitle: 'Comprehensive AI data solutions from data collection and annotation to model testing.',
    objective:
      'Capture and transcribe recordings from native speakers from 23 countries across multiple project types and data domains.',
    features: [
      '30,000+ native speaking human resources mobilized across 30+ countries',
      'Flexible industrial processes with continuous optimization',
      'Real-time progress tracking using PBI dashboards',
      'Real-time analysis and quality improvement across collection and transcription',
    ],
    results: [
      'Completed voice collection and annotation of 25,400 valid hours',
      'Delivered on time and with quality within 5 months',
      'Built scalable multilingual audio datasets for LLM and deep learning workflows',
    ],
    image: 'https://images.pexels.com/photos/7654118/pexels-photo-7654118.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/8438979/pexels-photo-8438979.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
  C: {
    title: 'Type C - Vertical LLM Data',
    subtitle: 'AI data solutions across specific industry verticals including autonomous driving and in-vehicle data collection.',
    objective:
      'Annotate vehicles, pedestrians, and road objects with 2D and 3D techniques to enable accurate object detection for autonomous driving.',
    features: [
      '2D, 3D and 4D data workflows for autonomous driving programs',
      'Dedicated Process Engineering team for analysis and optimization',
      'AI-enhanced workflow with multi-level quality checks',
      'Scalable global delivery through crowdsourced workforce management',
    ],
    results: [
      'Achieved 25% production in Month 1 with 95% accuracy (Target: 90%)',
      'Reached 50% production in Month 2 with 99% accuracy (Target: 95%)',
      'Maintained 99% overall accuracy with on-time delivery',
      'Expanded operations to Malaysia (100 annotators) and Indonesia (150 annotators)',
    ],
    image: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
  D: {
    title: 'Type D - AIGC Content',
    subtitle: 'AIGC localization for market-ready multilingual brand content.',
    objective:
      'Build culturally aligned, multilingual AIGC pipelines that convert source content into market-specific assets while preserving brand voice, quality, and compliance.',
    features: [
      'Story-first adaptation workflows for regional audience relevance',
      'Multilingual generation with human editorial calibration',
      'Market localization for campaign, product, and support content',
      'QA checkpoints for tone, factuality, and policy-safe publishing',
    ],
    results: [
      'Faster launch of localized content across global markets',
      'Higher consistency of message and brand voice across languages',
      'Lower production effort while maintaining enterprise quality',
    ],
    image: '/aigc/bottom-left.jpg',
    objectiveImage: '/aigc/approach-1.jpg',
    featuresImage: '/aigc/approach-2.jpg',
    resultsImage: '/aigc/approach-3.jpg',
  },
};

const typeDApproachImages = ['/aigc/approach-1.jpg', '/aigc/approach-2.jpg', '/aigc/approach-3.jpg'];
const typeDMiniCards = ['/aigc/mini-1.jpg', '/aigc/mini-2.jpg', '/aigc/mini-3.jpg'];
const typeDBottomLeftImage = '/aigc/bottom-left.jpg';
const typeDBottomRightImage = '/aigc/bottom-right.jpg';

const typeCHeroImage =
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop&dpr=2';

const typeCVerticalCards = [
  {
    title: 'Autonomous Driving',
    description: '2D, 3D, and 4D annotations for vehicles, pedestrians, road signs, and lane-level objects.',
    image: 'https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
  {
    title: 'Smart Cockpit',
    description: 'In-vehicle datasets for Driver Monitoring Systems and scenario-driven perception models.',
    image: 'https://images.pexels.com/photos/1042143/pexels-photo-1042143.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
  {
    title: 'Enterprise Vertical LLM',
    description: 'Domain-focused structured datasets for private LLM deployment in regulated operations.',
    image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
];

const heroDescriptions: Record<OfferTypeKey, string> = {
  A: 'End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.',
  B: 'Comprehensive AI data solutions that cover the entire spectrum from data collection and annotation to model testing, creating multimodal datasets for deep learning and large language models.',
  C: 'AI data solutions across specific industry verticals including autonomous driving data annotation, in-vehicle data collection and specialized data services for industry, enterprise or private LLM.',
  D: 'We apply AIGC to transform source material into culturally relevant, multilingual content that is ready for real-world brand and business use.',
};

const heroHighlights: Record<OfferTypeKey, [string, string]> = {
  A: [
    'Multi-language genealogy documents, newspapers, and archives to facilitate global ancestry research',
    'QQ Music of over millions non-Chinese songs and lyrics',
  ],
  B: [
    'Voice, image and text for Apple Intelligence',
    'Provided over 50 language sets',
  ],
  C: [
    '2D, 3D & 4D Data for Autonomous Driving',
    'The leading AI company in autonomous vehicle development',
  ],
  D: [
    'AIGC localization strategy with story continuity across regions',
    'Multilingual adaptation for 100+ market contexts and audience needs',
  ],
};

const heroTitles: Record<OfferTypeKey, [string, string]> = {
  A: ['Type A —', 'Data Servicing'],
  B: ['Type B —', 'Horizontal LLM Data'],
  C: ['Type C —', 'Vertical LLM Data'],
  D: ['Type D —', 'AIGC Content'],
};

const heroStats: Record<OfferTypeKey, Array<{ value: number; suffix: string; label: string }>> = {
  A: [
    { value: 50, suffix: '+', label: 'Languages' },
    { value: 40, suffix: '+', label: 'Delivery Centers' },
  ],
  B: [
    { value: 30000, suffix: '+', label: 'Native Speakers' },
    { value: 25400, suffix: 'h', label: 'Audio Collected' },
  ],
  C: [
    { value: 99, suffix: '%', label: 'Accuracy' },
    { value: 250, suffix: '+', label: 'Annotators' },
  ],
  D: [
    { value: 100, suffix: '+', label: 'Countries' },
    { value: 50, suffix: '+', label: 'Languages' },
  ],
};

const threadColors: Record<OfferTypeKey, [number, number, number]> = {
  A: [0.016, 0.384, 0.255],
  B: [0.016, 0.384, 0.255],
  C: [0.08, 0.26, 0.42],
  D: [1.0, 0.702, 0.278],
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
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

const OfferTypePage: React.FC<OfferTypePageProps> = ({ type, onNavigate }) => {
  const content = offerContent[type];
  const typeCCapLineOneRef = useRef<HTMLDivElement>(null);
  const typeCCapLineTwoRef = useRef<HTMLDivElement>(null);
  const typeDApproachStackRef = useRef<HTMLDivElement>(null);
  const [typeDScrollShift, setTypeDScrollShift] = useState(0);

  const panels = [
    { id: 'objective', title: 'Objective', label: '01 Objective', summary: content.objective, image: content.objectiveImage, list: [] as string[] },
    { id: 'features', title: 'Key Features', label: '02 Key Features', summary: 'Core functional capabilities we deliver:', image: content.featuresImage, list: content.features },
    { id: 'results', title: 'Results', label: '03 Results', summary: 'Expected business outcomes from this type:', image: content.resultsImage, list: content.results },
  ];

  useEffect(() => {
    if (type !== 'D') { setTypeDScrollShift(0); return; }
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const stack = typeDApproachStackRef.current;
        if (!stack) return;
        const rect = stack.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const distanceFromCenter = rect.top + rect.height * 0.5 - viewportCenter;
        const normalized = Math.max(-1, Math.min(1, distanceFromCenter / window.innerHeight));
        setTypeDScrollShift(normalized * -20);
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [type]);

  return (
    <section className="relative overflow-hidden bg-lifewood-paper">
      {/* ─── HERO WITH THREADS ─── */}
      <div className="relative overflow-hidden bg-[#0a0f0d]">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.3]">
          <Threads color={threadColors[type]} amplitude={0.5} distance={0.7} enableMouseInteraction={false} />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0a0f0d]/90" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-6 inline-block rounded-full border border-lifewood-saffron/25 bg-lifewood-saffron/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lifewood-saffron backdrop-blur-md">
                What We Offer
              </span>
              <div className="mb-4">
                <ScrollReveal
                  enableBlur
                  baseOpacity={0.1}
                  baseRotation={3}
                  blurStrength={4}
                  textClassName="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05]"
                >
                  {`${heroTitles[type][0]} ${heroTitles[type][1]}`}
                </ScrollReveal>
              </div>
              <div className="max-w-xl">
                <SplitText
                  text={heroDescriptions[type]}
                  className="text-base leading-relaxed text-white/55 md:text-lg"
                  delay={0.02}
                  duration={0.5}
                  ease="power2.out"
                  splitType="words"
                  from={{ opacity: 0, y: 16 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onNavigate(Page.CONTACT)}
                  className="group inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-7 py-3 font-bold text-lifewood-darkSerpent transition-all duration-300 hover:bg-white hover:shadow-xl"
                >
                  Contact Us <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                {heroStats[type].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-extrabold text-lifewood-saffron md:text-3xl">
                      <CountUp to={stat.value} duration={0.8} separator={stat.value >= 1000 ? ',' : ''} />
                      <span>{stat.suffix}</span>
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-1.5 border-l-2 border-lifewood-castleton/40 pl-4">
                {heroHighlights[type].map((h, i) => (
                  <p key={i} className="text-sm text-white/50">{h}</p>
                ))}
              </div>
            </div>

            {/* Hero right - image or video */}
            <div className="relative">
              {type === 'D' ? (
                <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
                  <video
                    src="/videos/type-d-hero.mp4"
                    className="h-[320px] w-full object-cover md:h-[420px]"
                    autoPlay muted loop playsInline preload="metadata" controls={false}
                    aria-label="AIGC hero visual"
                  />
                </div>
              ) : (
                <div className="group overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
                  <img
                    src={type === 'C' ? typeCHeroImage : content.image}
                    alt={content.title}
                    className="h-[320px] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04] md:h-[420px]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TYPE C: VERTICAL CARDS ─── */}
      {type === 'C' && (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {typeCVerticalCards.map((card, i) => (
                <RevealOnScroll key={card.title} delay={i * 100}>
                  <article className="group overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lifewood-castleton/25 hover:shadow-[0_14px_30px_rgba(19,48,32,0.16)]">
                    <img src={card.image} alt={card.title} className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-lifewood-darkSerpent transition-colors duration-300 group-hover:text-lifewood-castleton">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-lifewood-darkSerpent/75">{card.description}</p>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="mt-12 rounded-2xl border border-lifewood-darkSerpent/10 bg-lifewood-seasalt p-6 text-center md:p-10">
              <div ref={typeCCapLineOneRef} className="hidden md:block">
                <h2 className="text-2xl font-bold text-lifewood-darkSerpent md:text-5xl md:leading-tight">
                  <VariableProximity
                    label="2D, 3D & 4D Data for Autonomous Driving"
                    fromFontVariationSettings="'wght' 620"
                    toFontVariationSettings="'wght' 900"
                    containerRef={typeCCapLineOneRef}
                    radius={95}
                    falloff="exponential"
                  />
                </h2>
              </div>
              <h2 className="text-2xl font-bold text-lifewood-darkSerpent md:hidden">2D, 3D & 4D Data for Autonomous Driving</h2>
              <div ref={typeCCapLineTwoRef} className="mt-1 hidden md:block">
                <p className="text-3xl font-semibold leading-tight text-lifewood-darkSerpent/52">
                  <VariableProximity
                    label="The leading AI company in autonomous vehicle development"
                    fromFontVariationSettings="'wght' 420"
                    toFontVariationSettings="'wght' 760"
                    containerRef={typeCCapLineTwoRef}
                    radius={95}
                    falloff="exponential"
                  />
                </p>
              </div>
              <p className="mt-1 text-lg font-medium text-lifewood-darkSerpent/62 md:hidden">The leading AI company in autonomous vehicle development</p>
              <p className="mx-auto mt-5 max-w-4xl text-sm leading-relaxed text-lifewood-darkSerpent/78 md:text-base">
                Annotate vehicles, pedestrians, and road objects with 2D and 3D techniques to enable accurate object detection for autonomous driving. Self-driving systems rely on precise visual training to detect, classify, and respond safely in real-world conditions.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      )}

      {/* ─── TYPE D: APPROACH + MINI CARDS + BOTTOM IMAGES ─── */}
      {type === 'D' && (
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
              <article className="pt-1 md:col-span-5">
                <h2 className="text-[2rem] font-medium leading-tight text-lifewood-darkSerpent">Our Approach</h2>
                <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/70 md:text-base">
                  Our motivation is to express the personality of your brand in a compelling communication style that stands out.
                </p>
              </article>
              <article className="md:col-span-7">
                <div ref={typeDApproachStackRef} className="relative ml-auto h-[320px] w-[340px] md:h-[390px] md:w-[520px]">
                  <img src={typeDApproachImages[0]} alt="AIGC stack 1" className="absolute left-[150px] top-0 h-[170px] w-[155px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[250px] md:top-0 md:h-[250px] md:w-[220px]" style={{ transform: `translateY(${typeDScrollShift * 0.7}px) rotate(12deg)` }} />
                  <img src={typeDApproachImages[1]} alt="AIGC stack 2" className="absolute left-[84px] top-[22px] h-[210px] w-[185px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[150px] md:top-[50px] md:h-[280px] md:w-[250px]" style={{ transform: `translateY(${typeDScrollShift * -0.5}px) rotate(-6deg)` }} />
                  <img src={typeDApproachImages[2]} alt="AIGC stack 3" className="absolute left-[52px] top-[54px] h-[224px] w-[198px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[92px] md:top-[92px] md:h-[300px] md:w-[270px]" style={{ transform: `translateY(${typeDScrollShift * 1.1}px) rotate(4deg)` }} />
                </div>
              </article>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              <article className="md:col-span-5">
                <p className="text-base leading-relaxed text-lifewood-darkSerpent/78 md:text-[1.2rem]">
                  We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
                </p>
              </article>
              <article className="md:col-span-7">
                <div className="grid grid-cols-3 gap-3">
                  {typeDMiniCards.map((src) => (
                    <div key={src} className="overflow-hidden rounded-md border border-lifewood-darkSerpent/12 bg-white">
                      <img src={src} alt="AIGC mini card" className="h-36 w-full object-cover md:h-44" />
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={180}>
            <div className="border-t border-lifewood-darkSerpent/15 pt-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="overflow-hidden rounded-md md:col-span-8">
                  <img src={typeDBottomLeftImage} alt="AIGC culture and language" className="h-[280px] w-full object-cover md:h-[330px]" />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 md:col-span-4">
                  <div className="overflow-hidden rounded-md">
                    <img src={typeDBottomRightImage} alt="Multiple languages" className="h-[280px] w-full object-cover md:h-[330px]" />
                  </div>
                  <div className="self-center rounded-md bg-[#ebebeb] px-3 py-4 text-center">
                    <p className="text-2xl font-extrabold text-lifewood-darkSerpent">
                      <CountUp to={100} duration={0.8} />+
                    </p>
                    <p className="text-[0.66rem] uppercase tracking-[0.1em] text-lifewood-darkSerpent/55">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <blockquote className="mx-auto max-w-6xl py-10 text-center md:py-14">
            <ScrollReveal
              baseOpacity={0.14}
              enableBlur
              baseRotation={2}
              blurStrength={3}
              containerClassName="mx-auto max-w-5xl"
              textClassName="text-balance text-[1.65rem] leading-[1.34] text-lifewood-darkSerpent md:text-[1.95rem]"
              rotationEnd="bottom top+=15%"
              wordAnimationEnd="bottom top+=15%"
              scrub={1.1}
            >
              {'"We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality."'}
            </ScrollReveal>
            <p className="mt-4 text-[1.6rem] leading-none text-lifewood-darkSerpent/55">- Lifewood -</p>
          </blockquote>
        </div>
      )}

      {/* ─── OBJECTIVE / FEATURES / RESULTS PANELS ─── */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-10 text-center">
            <GradientText
              className="text-sm font-bold uppercase tracking-[0.2em]"
              colors={['#046241', '#FFB347', '#FFC370', '#046241']}
              animationSpeed={6}
              direction="horizontal"
            >
              Deep Dive
            </GradientText>
            <h2 className="mt-3 text-3xl font-bold text-lifewood-darkSerpent md:text-4xl">
              How {heroTitles[type][1]} Works
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {panels.map((panel, index) => {
            const frontThemes = [
              { frontBg: 'bg-lifewood-darkSerpent', frontText: 'text-white', border: 'border-lifewood-castleton/25', backBg: 'bg-white' },
              { frontBg: 'bg-lifewood-castleton', frontText: 'text-white', border: 'border-lifewood-saffron/35', backBg: 'bg-lifewood-seasalt' },
              { frontBg: 'bg-lifewood-saffron', frontText: 'text-white', border: 'border-lifewood-earth/50', backBg: 'bg-white' },
            ];
            const theme = frontThemes[index % frontThemes.length];

            return (
              <RevealOnScroll key={panel.id} delay={index * 100}>
                <article className="rounded-2xl">
                  <PixelTransition
                    gridSize={10}
                    pixelColor={index === 2 ? '#0d3b2f' : '#ffffff'}
                    animationStepDuration={0.18}
                    once={false}
                    aspectRatio="0%"
                    className="h-[430px] w-full rounded-2xl md:h-[440px]"
                    firstContent={
                      <div className={`relative h-full w-full overflow-hidden rounded-2xl border shadow-sm ${theme.frontBg} ${theme.border}`}>
                        <img src={panel.image} alt={panel.title} className="absolute inset-0 h-full w-full object-cover opacity-22" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                        <div className="relative z-10 flex h-full flex-col justify-between p-5">
                          <div className={`inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${theme.frontText}`}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <p className={`text-[1.55rem] font-bold leading-[1.08] md:text-[1.75rem] ${theme.frontText}`}>
                              {panel.title === 'Key Features' ? 'Solutions' : panel.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                    secondContent={
                      <div className={`flex h-full w-full flex-col rounded-2xl border p-5 shadow-xl ${theme.backBg} ${theme.border}`}>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lifewood-castleton/80">
                          {String(index + 1).padStart(2, '0')} {panel.title === 'Key Features' ? 'Solutions' : panel.title}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-lifewood-darkSerpent">
                          {panel.title === 'Key Features' ? 'Solutions' : panel.title}
                        </h3>
                        <p className="mt-3 shrink-0 text-sm leading-relaxed text-lifewood-darkSerpent/74">{panel.summary}</p>
                        {panel.list.length > 0 && (
                          <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                            {panel.list.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-[0.9rem] leading-snug text-lifewood-darkSerpent/80">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lifewood-castleton/90" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    }
                  />
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* ─── CTA FOOTER ─── */}
      <div className="relative overflow-hidden bg-[#0a0f0d] py-20">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.2]">
          <Threads color={threadColors[type]} amplitude={0.3} distance={1.0} enableMouseInteraction={false} />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <ScrollReveal
            enableBlur
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={3}
            textClassName="text-2xl md:text-4xl font-bold text-white"
          >
            {`Ready to explore ${heroTitles[type][1]}?`}
          </ScrollReveal>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/45">
            Our engineers and data specialists are ready to integrate with your workflow. Experience the precision of Lifewood&apos;s data engine.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => onNavigate(Page.CONTACT)}
              className="group inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-8 py-3.5 font-bold text-lifewood-darkSerpent shadow-xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105"
            >
              Get in Touch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <GradientText
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              colors={['#046241', '#FFB347', '#FFC370', '#046241']}
              animationSpeed={8}
              direction="horizontal"
            >
              Lifewood — Engineering the future of data
            </GradientText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferTypePage;
