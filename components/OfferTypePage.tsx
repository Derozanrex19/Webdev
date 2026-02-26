import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import VariableProximity from './VariableProximity';
import PixelTransition from './PixelTransition';
import ScrollReveal from './ScrollReveal';

type OfferTypeKey = 'A' | 'B' | 'C' | 'D';
type OrbKey = 'orbA' | 'orbB' | 'orbC';

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

const typeDApproachImages = [
  '/aigc/approach-1.jpg',
  '/aigc/approach-2.jpg',
  '/aigc/approach-3.jpg',
];

const typeDMiniCards = [
  '/aigc/mini-1.jpg',
  '/aigc/mini-2.jpg',
  '/aigc/mini-3.jpg',
];

const typeDBottomLeftImage =
  '/aigc/bottom-left.jpg';

const typeDBottomRightImage =
  '/aigc/bottom-right.jpg';

const typeCHeroImage =
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop&dpr=2';

const typeCVerticalCards = [
  {
    title: 'Autonomous Driving',
    description: '2D, 3D, and 4D annotations for vehicles, pedestrians, road signs, and lane-level objects.',
    image:
      'https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
  {
    title: 'Smart Cockpit',
    description: 'In-vehicle datasets for Driver Monitoring Systems and scenario-driven perception models.',
    image:
      'https://images.pexels.com/photos/1042143/pexels-photo-1042143.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
  {
    title: 'Enterprise Vertical LLM',
    description: 'Domain-focused structured datasets for private LLM deployment in regulated operations.',
    image:
      'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2',
  },
];

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
  const [orbPositions, setOrbPositions] = useState({
    orbA: { x: 0, y: 0 },
    orbB: { x: 0, y: 0 },
    orbC: { x: 0, y: 0 },
  });
  const [dragState, setDragState] = useState<{
    key: OrbKey;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);
  const heroTitles: Record<OfferTypeKey, [string, string]> = {
    A: ['Type A -', 'Data Servicing'],
    B: ['Type B -', 'Horizontal LLM Data'],
    C: ['Type C -', 'Vertical LLM Data'],
    D: ['Type D -', 'AIGC Content'],
  };

  const heroDescriptions: Record<OfferTypeKey, string> = {
    A:
      'End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.',
    B:
      'Comprehensive AI data solutions that cover the entire spectrum from data collection and annotation to model testing, creating multimodal datasets for deep learning and large language models.',
    C:
      'AI data solutions across specific industry verticals including autonomous driving data annotation, in-vehicle data collection and specialized data services for industry, enterprise or private LLM.',
    D:
      'We apply AIGC to transform source material into culturally relevant, multilingual content that is ready for real-world brand and business use.',
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

  const heroOrbs: Record<
    OfferTypeKey,
    Array<{
      key: OrbKey;
      wrapperClass: string;
      shapeClass: string;
      rotation: number;
      gradient: string;
      shadow: string;
      floatAnim: string;
      imageSrc?: string;
    }>
  > = {
    A: [
      {
        key: 'orbA',
        wrapperClass: 'absolute left-[8%] top-[6%] h-24 w-24',
        shapeClass: 'rounded-[44%]',
        rotation: 12,
        gradient: 'radial-gradient(circle at 30% 25%, #6a6a6a 0%, #222 46%, #050505 74%, #7a7a7a 100%)',
        shadow: '0 12px 30px rgba(0,0,0,0.28)',
        floatAnim: 'animate-[orbFloatA_4.8s_ease-in-out_infinite]',
        imageSrc: '/orbs/1-float-v2.png',
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[6%] top-[0%] h-28 w-28',
        shapeClass: 'rounded-[46%]',
        rotation: -18,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.28)',
        floatAnim: 'animate-[orbFloatB_5.2s_ease-in-out_infinite]',
        imageSrc: '/orbs/2-float-v2.png',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[2%] right-[16%] h-40 w-40',
        shapeClass: 'rounded-[40%]',
        rotation: 20,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.6s_ease-in-out_infinite]',
        imageSrc: '/orbs/3-float-v2.png',
      },
    ],
    B: [
      {
        key: 'orbA',
        wrapperClass: 'absolute left-[8%] top-[10%] h-24 w-24',
        shapeClass: 'rounded-[34%_66%_58%_42%/44%_40%_60%_56%]',
        rotation: 14,
        gradient: 'radial-gradient(circle at 30% 25%, #6a6a6a 0%, #222 46%, #050505 74%, #7a7a7a 100%)',
        shadow: '0 12px 30px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatA_5s_ease-in-out_infinite]',
        imageSrc: '/orbs/1-float-v2.png',
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[10%] top-[4%] h-28 w-28',
        shapeClass: 'rounded-[60%_40%_45%_55%/42%_58%_38%_62%]',
        rotation: -16,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatB_5.4s_ease-in-out_infinite]',
        imageSrc: '/orbs/2-float-v2.png',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[6%] right-[18%] h-40 w-40',
        shapeClass: 'rounded-[42%_58%_50%_50%/36%_46%_54%_64%]',
        rotation: 18,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.8s_ease-in-out_infinite]',
        imageSrc: '/orbs/3-float-v2.png',
      },
    ],
    C: [
      {
        key: 'orbA',
        wrapperClass: 'absolute left-[12%] top-[9%] h-24 w-24',
        shapeClass: 'rounded-[52%_48%_44%_56%/48%_36%_64%_52%]',
        rotation: 10,
        gradient: 'radial-gradient(circle at 30% 25%, #6a6a6a 0%, #222 46%, #050505 74%, #7a7a7a 100%)',
        shadow: '0 12px 30px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatA_4.9s_ease-in-out_infinite]',
        imageSrc: '/orbs/1-float-v2.png',
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[9%] top-[1%] h-28 w-28',
        shapeClass: 'rounded-[38%_62%_58%_42%/44%_58%_42%_56%]',
        rotation: -20,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatB_5.1s_ease-in-out_infinite]',
        imageSrc: '/orbs/2-float-v2.png',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[6%] right-[22%] h-40 w-40',
        shapeClass: 'rounded-[46%_54%_38%_62%/42%_48%_52%_58%]',
        rotation: 22,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.7s_ease-in-out_infinite]',
        imageSrc: '/orbs/3-float-v2.png',
      },
    ],
    D: [
      {
        key: 'orbA',
        wrapperClass: 'absolute left-[9%] top-[8%] h-24 w-24',
        shapeClass: 'rounded-[48%_52%_62%_38%/50%_42%_58%_50%]',
        rotation: 11,
        gradient: 'radial-gradient(circle at 30% 25%, #6a6a6a 0%, #222 46%, #050505 74%, #7a7a7a 100%)',
        shadow: '0 12px 30px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatA_5.2s_ease-in-out_infinite]',
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[8%] top-[3%] h-28 w-28',
        shapeClass: 'rounded-[58%_42%_46%_54%/40%_62%_38%_60%]',
        rotation: -15,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatB_5.5s_ease-in-out_infinite]',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[5%] right-[19%] h-40 w-40',
        shapeClass: 'rounded-[44%_56%_40%_60%/46%_44%_56%_54%]',
        rotation: 19,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.9s_ease-in-out_infinite]',
      },
    ],
  };

  const panels = [
    {
      id: 'objective',
      title: 'Objective',
      label: '01 Objective',
      summary: content.objective,
      image: content.objectiveImage,
      list: [],
    },
    {
      id: 'features',
      title: 'Key Features',
      label: '02 Key Features',
      summary: 'Core functional capabilities we deliver:',
      image: content.featuresImage,
      list: content.features,
    },
    {
      id: 'results',
      title: 'Results',
      label: '03 Results',
      summary: 'Expected business outcomes from this type:',
      image: content.resultsImage,
      list: content.results,
    },
  ];

  useEffect(() => {
    setOrbPositions({
      orbA: { x: 0, y: 0 },
      orbB: { x: 0, y: 0 },
      orbC: { x: 0, y: 0 },
    });
    setDragState(null);
  }, [type]);

  useEffect(() => {
    if (!dragState) return;

    const DEADZONE = 4;

    const handlePointerMove = (event: PointerEvent) => {
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      const distance = Math.hypot(dx, dy);

      if (!dragState.moved && distance < DEADZONE) return;

      if (!dragState.moved) {
        setDragState((prev) => (prev ? { ...prev, moved: true } : prev));
      }

      const nextX = dragState.baseX + dx;
      const nextY = dragState.baseY + dy;

      setOrbPositions((prev) => ({
        ...prev,
        [dragState.key]: {
          x: Math.max(-50, Math.min(50, nextX)),
          y: Math.max(-50, Math.min(50, nextY)),
        },
      }));
    };

    const handlePointerUp = () => {
      setOrbPositions((prev) => ({
        ...prev,
        [dragState.key]: { x: 0, y: 0 },
      }));
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState]);

  useEffect(() => {
    if (type !== 'D') {
      setTypeDScrollShift(0);
      return;
    }

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
      <div className="absolute -right-24 top-6 h-72 w-72 rounded-full bg-lifewood-saffron/10 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-lifewood-castleton/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className={`mb-8 rounded-[34px] p-6 md:p-8 ${type === 'D' ? 'bg-transparent' : 'bg-lifewood-paper'}`}>
          {type === 'D' ? (
            <div className="space-y-8 animate-[fadeUp_700ms_ease-out]">
              <div className="max-w-5xl animate-[fadeUp_850ms_ease-out]">
                <div className="mb-3 inline-flex items-center gap-1.5 text-lifewood-darkSerpent/70">
                  <span className="h-3 w-3 rounded-full bg-black"></span>
                  <span className="h-3 w-3 rounded-full border border-black"></span>
                  <span className="ml-1 block h-px w-24 bg-lifewood-darkSerpent/40"></span>
                </div>
                <h1 className="text-[2.4rem] font-semibold leading-[0.96] text-black md:text-[4.6rem]">
                  AI Generated Content (AIGC)
                </h1>
                <p className="mt-6 max-w-5xl text-[1.04rem] leading-relaxed text-lifewood-darkSerpent/78 md:text-[1.14rem]">
                  Lifewood's early adoption of AI tools has seen the company rapidly evolve the use of AI generated content,
                  integrated into video production for communication requirements.
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

              <div className="overflow-hidden rounded-[38px] border border-lifewood-darkSerpent/10 bg-black shadow-2xl animate-[fadeUp_950ms_ease-out]">
                <video
                  src="/videos/type-d-hero.mp4"
                  className="h-[300px] w-full object-cover md:h-[460px] lg:h-[520px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  aria-label="AIGC hero visual"
                />
              </div>
            </div>
          ) : type === 'C' ? (
            <div className="space-y-8 font-sans animate-[fadeUp_700ms_ease-out]">
              <RevealOnScroll>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6">
                  <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-black md:text-7xl">
                    Type C -<br />
                    Vertical LLM Data
                  </h1>
                  <p className="mt-5 max-w-[42rem] text-[1.05rem] leading-[1.58] text-lifewood-darkSerpent/90">
                    AI data solutions across specific industry verticals including autonomous driving data annotation,
                    in-vehicle data collection, and specialized data services for industry, enterprise, or private LLM.
                  </p>
                  <button
                    onClick={() => onNavigate(Page.CONTACT)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-lifewood-castleton bg-lifewood-saffron px-4 py-2 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
                  >
                    Contact Us
                  </button>
                  <div className="mt-8 space-y-1 text-sm text-lifewood-darkSerpent/90">
                    <p>2D, 3D & 4D Data for Autonomous Driving</p>
                    <p>The leading AI company in autonomous vehicle development</p>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="group relative overflow-hidden rounded-[28px] border border-lifewood-darkSerpent/10 bg-black shadow-2xl transition-all duration-500 hover:shadow-[0_24px_48px_rgba(19,48,32,0.28)]">
                    <img
                      src={typeCHeroImage}
                      alt="Vertical LLM Data visual"
                      className="h-[320px] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04] md:h-[380px]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-50"></div>
                  </div>
                </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {typeCVerticalCards.map((card) => (
                  <article
                    key={card.title}
                    className="group overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lifewood-castleton/25 hover:shadow-[0_14px_30px_rgba(19,48,32,0.16)]"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-44 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-lifewood-darkSerpent transition-colors duration-300 group-hover:text-lifewood-castleton">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-lifewood-darkSerpent/75">{card.description}</p>
                    </div>
                  </article>
                ))}
                </section>
              </RevealOnScroll>

              <RevealOnScroll delay={220}>
                <section className="group rounded-2xl border border-lifewood-darkSerpent/10 bg-lifewood-seasalt p-6 transition-all duration-300 hover:border-lifewood-castleton/25 hover:shadow-[0_12px_28px_rgba(19,48,32,0.12)] md:p-8">
                <div className="mt-2 text-center">
                  <div ref={typeCCapLineOneRef} className="hidden md:block">
                    <h2 className="text-2xl font-bold text-lifewood-darkSerpent transition-transform duration-300 group-hover:scale-[1.01] md:text-5xl md:leading-tight">
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
                  <h2 className="text-2xl font-bold text-lifewood-darkSerpent md:hidden">
                    2D, 3D & 4D Data for Autonomous Driving
                  </h2>

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
                  <p className="mt-1 text-lg font-medium text-lifewood-darkSerpent/62 md:hidden">
                    The leading AI company in autonomous vehicle development
                  </p>
                </div>
                <p className="mx-auto mt-5 max-w-4xl text-center text-sm leading-relaxed text-lifewood-darkSerpent/78 md:text-base">
                  Annotate vehicles, pedestrians, and road objects with 2D and 3D techniques to enable accurate object
                  detection for autonomous driving. Self-driving systems rely on precise visual training to detect,
                  classify, and respond safely in real-world conditions.
                </p>
                </section>
              </RevealOnScroll>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-black md:text-7xl">
                  {heroTitles[type][0]}<br />
                  {heroTitles[type][1]}
                </h1>
                <p className="mt-5 max-w-[42rem] text-[1.05rem] leading-[1.58] text-lifewood-darkSerpent/90">
                  {heroDescriptions[type]}
                </p>
                <button
                  onClick={() => onNavigate(Page.CONTACT)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-lifewood-castleton bg-lifewood-saffron px-4 py-2 text-sm font-bold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
                >
                  Contact Us
                </button>
                <div className="mt-10 space-y-1 text-sm text-lifewood-darkSerpent/90">
                  <p>{heroHighlights[type][0]}</p>
                  <p>{heroHighlights[type][1]}</p>
                </div>
              </div>

              <div className="relative h-[360px] overflow-hidden lg:col-span-6">
                {heroOrbs[type].map((orb) => (
                  <div
                    key={orb.key}
                    className={`${orb.wrapperClass} cursor-grab active:cursor-grabbing`}
                    style={{
                      transform: `translate(${orbPositions[orb.key].x}px, ${orbPositions[orb.key].y}px) rotate(${orb.rotation}deg)`,
                      transition: dragState?.key === orb.key ? 'none' : 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setDragState({
                        key: orb.key,
                        startX: event.clientX,
                        startY: event.clientY,
                        baseX: orbPositions[orb.key].x,
                        baseY: orbPositions[orb.key].y,
                        moved: false,
                      });
                    }}
                  >
                    <div
                      className={`h-full w-full ${orb.shapeClass} ${orb.floatAnim}`}
                      style={{
                        boxShadow: orb.shadow,
                      }}
                    >
                      {orb.imageSrc ? (
                        <img
                          src={orb.imageSrc}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full scale-[1.18] select-none object-contain drop-shadow-[0_16px_22px_rgba(0,0,0,0.28)]"
                          draggable={false}
                        />
                      ) : (
                        <div
                          className={`h-full w-full ${orb.shapeClass}`}
                          style={{
                            backgroundImage: orb.gradient,
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {type === 'D' && (
          <div className="mb-8 space-y-8 animate-[fadeUp_800ms_ease-out]">
            <section className="relative grid grid-cols-1 items-start gap-6 overflow-hidden pb-6 md:grid-cols-12 md:pb-10">
              <article className="md:col-span-5 pt-1">
                <h2 className="text-[2rem] font-medium leading-tight text-lifewood-darkSerpent">Our Approach</h2>
                <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/70 md:text-base">
                  Our motivation is to express the personality of your brand in a compelling communication style that stands out.
                </p>
              </article>
              <article className="md:col-span-7">
                <div ref={typeDApproachStackRef} className="relative ml-auto h-[320px] w-[340px] md:h-[390px] md:w-[520px]">
                  <img
                    src={typeDApproachImages[0]}
                    alt="AIGC stack 1"
                    className="absolute left-[150px] top-0 h-[170px] w-[155px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[250px] md:top-0 md:h-[250px] md:w-[220px]"
                    style={{ transform: `translateY(${typeDScrollShift * 0.7}px) rotate(12deg)` }}
                  />
                  <img
                    src={typeDApproachImages[1]}
                    alt="AIGC stack 2"
                    className="absolute left-[84px] top-[22px] h-[210px] w-[185px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[150px] md:top-[50px] md:h-[280px] md:w-[250px]"
                    style={{ transform: `translateY(${typeDScrollShift * -0.5}px) rotate(-6deg)` }}
                  />
                  <img
                    src={typeDApproachImages[2]}
                    alt="AIGC stack 3"
                    className="absolute left-[52px] top-[54px] h-[224px] w-[198px] rounded-sm object-cover shadow-xl transition-transform duration-200 md:left-[92px] md:top-[92px] md:h-[300px] md:w-[270px]"
                    style={{ transform: `translateY(${typeDScrollShift * 1.1}px) rotate(4deg)` }}
                  />
                </div>
              </article>
            </section>

            <section className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              <article className="md:col-span-5">
                <p className="text-base leading-relaxed text-lifewood-darkSerpent/78 md:text-[1.2rem]">
                  We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
                </p>
              </article>
              <article className="md:col-span-7">
                <div className="grid grid-cols-3 gap-3">
                  {typeDMiniCards.map((src) => (
                    <div key={src} className="overflow-hidden rounded-md border border-lifewood-darkSerpent/12 bg-white animate-[fadeUp_900ms_ease-out]">
                      <img src={src} alt="AIGC mini card" className="h-36 w-full object-cover md:h-44" />
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="border-t border-lifewood-darkSerpent/15 pt-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="md:col-span-8 overflow-hidden rounded-md">
                  <img src={typeDBottomLeftImage} alt="AIGC culture and language" className="h-[280px] w-full object-cover md:h-[330px]" />
                </div>
                <div className="md:col-span-4 grid grid-cols-[1fr_auto] gap-2">
                  <div className="overflow-hidden rounded-md">
                    <img src={typeDBottomRightImage} alt="Multiple languages" className="h-[280px] w-full object-cover md:h-[330px]" />
                  </div>
                  <div className="self-center rounded-md bg-[#ebebeb] px-3 py-4 text-center">
                    <p className="text-2xl font-extrabold text-lifewood-darkSerpent">100+</p>
                    <p className="text-[0.66rem] uppercase tracking-[0.1em] text-lifewood-darkSerpent/55">Countries</p>
                  </div>
                </div>
              </div>
            </section>

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
                {'“We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality.”'}
              </ScrollReveal>
              <p className="mt-4 text-[1.6rem] leading-none text-lifewood-darkSerpent/55">- Lifewood -</p>
            </blockquote>
          </div>
        )}

        <div className={type === 'D' ? 'mt-8 md:mt-10' : 'mt-0'}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {panels.map((panel, index) => {
              const frontThemes = [
                {
                  frontBg: 'bg-lifewood-darkSerpent',
                  frontText: 'text-white',
                  border: 'border-lifewood-castleton/25',
                  backBg: 'bg-white',
                },
                {
                  frontBg: 'bg-lifewood-castleton',
                  frontText: 'text-white',
                  border: 'border-lifewood-saffron/35',
                  backBg: 'bg-lifewood-seasalt',
                },
                {
                  frontBg: 'bg-lifewood-saffron',
                  frontText: 'text-white',
                  border: 'border-lifewood-earth/50',
                  backBg: 'bg-white',
                },
              ];
              const theme = frontThemes[index % frontThemes.length];

              return (
                <article key={panel.id} className="rounded-2xl">
                  <PixelTransition
                    gridSize={10}
                    pixelColor={index === 2 ? '#0d3b2f' : '#ffffff'}
                    animationStepDuration={0.18}
                    once={false}
                    aspectRatio="0%"
                    className="h-[420px] w-full rounded-2xl md:h-[430px]"
                    style={{}}
                    firstContent={
                      <div className={`relative h-full w-full overflow-hidden rounded-2xl border shadow-sm ${theme.frontBg} ${theme.border}`}>
                        <img
                          src={panel.image}
                          alt={panel.title}
                          className="absolute inset-0 h-full w-full object-cover opacity-22"
                        />
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
                        <p className="mt-3 shrink-0 text-sm leading-relaxed text-lifewood-darkSerpent/74">
                          {panel.summary}
                        </p>
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
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imageReveal {
          from { opacity: 0.65; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mediaZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }
        @keyframes orbFloatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes orbFloatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes orbFloatC {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default OfferTypePage;
