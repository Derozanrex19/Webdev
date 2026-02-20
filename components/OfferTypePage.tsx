import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';

type OfferTypeKey = 'A' | 'B' | 'C' | 'D';
type OrbKey = 'orbA' | 'orbB' | 'orbC';

interface OfferTypePageProps {
  type: OfferTypeKey;
  onNavigate: (page: Page) => void;
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
    title: 'Type A - Data Service',
    subtitle: 'Enterprise-grade data collection, processing, and quality operations.',
    objective:
      'Build high-quality AI-ready datasets with scalable workflows, expert review layers, and measurable quality controls.',
    features: [
      'Managed data collection across text, image, audio, and video',
      'Human-in-the-loop annotation and validation workflows',
      'Quality scoring, dispute resolution, and calibration cycles',
      'Security-first handling for sensitive enterprise datasets',
    ],
    results: [
      'Faster dataset readiness for model training',
      'Higher annotation consistency across large teams',
      'Reduced rework and lower production overhead',
    ],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/5716032/pexels-photo-5716032.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
  B: {
    title: 'Type B - Vertical LLM Data',
    subtitle: 'Domain-specific datasets for expert language intelligence.',
    objective:
      'Develop deep, high-fidelity corpora for regulated or specialized industries such as legal, healthcare, and finance.',
    features: [
      'Domain-grounded prompt-response datasets',
      'Terminology-aligned instruction tuning data',
      'Expert review pipelines for factual precision',
      'Evaluation sets mapped to industry use cases',
    ],
    results: [
      'Improved model reliability in specialized contexts',
      'Higher factual and terminology accuracy',
      'More trustworthy enterprise assistants',
    ],
    image: 'https://images.pexels.com/photos/7654118/pexels-photo-7654118.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/8438979/pexels-photo-8438979.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
  C: {
    title: 'Type C - Horizontal LLM Data',
    subtitle: 'Broad-domain language data for cross-industry foundation models.',
    objective:
      'Scale multilingual, cross-domain datasets that improve model versatility and support generalized reasoning tasks.',
    features: [
      'Large-scale instruction datasets across diverse domains',
      'Multilingual and culturally varied data pipelines',
      'Conversation quality filters and toxicity controls',
      'Balanced coverage for broad real-world utility',
    ],
    results: [
      'Stronger model generalization',
      'Better multilingual performance',
      'Safer, more consistent output quality',
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
    image: 'https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/7567208/pexels-photo-7567208.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
};

const typeDHeroImage =
  'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1200&fit=crop&dpr=2';

const typeDApproachImages = [
  'https://images.pexels.com/photos/8294555/pexels-photo-8294555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
  'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
  'https://images.pexels.com/photos/7567558/pexels-photo-7567558.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&dpr=2',
];

const typeDMiniCards = [
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop&dpr=2',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop&dpr=2',
  'https://images.pexels.com/photos/7567435/pexels-photo-7567435.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop&dpr=2',
];

const typeDBottomLeftImage =
  'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&fit=crop&dpr=2';

const typeDBottomRightImage =
  'https://images.pexels.com/photos/7567484/pexels-photo-7567484.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&fit=crop&dpr=2';

const OfferTypePage: React.FC<OfferTypePageProps> = ({ type, onNavigate }) => {
  const content = offerContent[type];
  const [activeIndex, setActiveIndex] = useState(0);
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
    B: ['Type B -', 'Vertical LLM Data'],
    C: ['Type C -', 'Horizontal LLM Data'],
    D: ['Type D -', 'AIGC Content'],
  };

  const heroDescriptions: Record<OfferTypeKey, string> = {
    A:
      'End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.',
    B:
      'Domain-specific datasets for expert language intelligence, tuned for regulated and high-precision enterprise environments.',
    C:
      'Broad-domain multilingual datasets built to improve foundation model versatility and generalized reasoning quality.',
    D:
      'We apply AIGC to transform source material into culturally relevant, multilingual content that is ready for real-world brand and business use.',
  };
  const heroHighlights: Record<OfferTypeKey, [string, string]> = {
    A: [
      'Multi-language genealogy documents, newspapers, and archives to facilitate global ancestry research',
      'QQ Music of over millions non-Chinese songs and lyrics',
    ],
    B: [
      'Terminology-aligned training corpora for legal, healthcare, and finance domains',
      'Expert-validated datasets to improve factual precision and domain trustworthiness',
    ],
    C: [
      'Cross-domain instruction and conversation data across multiple industries',
      'Safety-filtered multilingual datasets for broader production reliability',
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
    }>
  > = {
    A: [
      {
        key: 'orbA',
        wrapperClass: 'absolute left-[10%] top-[8%] h-24 w-24',
        shapeClass: 'rounded-[44%]',
        rotation: 12,
        gradient: 'radial-gradient(circle at 30% 25%, #6a6a6a 0%, #222 46%, #050505 74%, #7a7a7a 100%)',
        shadow: '0 12px 30px rgba(0,0,0,0.28)',
        floatAnim: 'animate-[orbFloatA_4.8s_ease-in-out_infinite]',
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[8%] top-[2%] h-28 w-28',
        shapeClass: 'rounded-[46%]',
        rotation: -18,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.28)',
        floatAnim: 'animate-[orbFloatB_5.2s_ease-in-out_infinite]',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[5%] right-[20%] h-40 w-40',
        shapeClass: 'rounded-[40%]',
        rotation: 20,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.6s_ease-in-out_infinite]',
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
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[10%] top-[4%] h-28 w-28',
        shapeClass: 'rounded-[60%_40%_45%_55%/42%_58%_38%_62%]',
        rotation: -16,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatB_5.4s_ease-in-out_infinite]',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[6%] right-[18%] h-40 w-40',
        shapeClass: 'rounded-[42%_58%_50%_50%/36%_46%_54%_64%]',
        rotation: 18,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.8s_ease-in-out_infinite]',
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
      },
      {
        key: 'orbB',
        wrapperClass: 'absolute right-[9%] top-[1%] h-28 w-28',
        shapeClass: 'rounded-[38%_62%_58%_42%/44%_58%_42%_56%]',
        rotation: -20,
        gradient: 'radial-gradient(circle at 34% 30%, #666 0%, #232323 46%, #020202 76%, #707070 100%)',
        shadow: '0 14px 32px rgba(0,0,0,0.32)',
        floatAnim: 'animate-[orbFloatB_5.1s_ease-in-out_infinite]',
      },
      {
        key: 'orbC',
        wrapperClass: 'absolute bottom-[6%] right-[22%] h-40 w-40',
        shapeClass: 'rounded-[46%_54%_38%_62%/42%_48%_52%_58%]',
        rotation: 22,
        gradient: 'radial-gradient(circle at 34% 25%, #8c8c8c 0%, #2b2b2b 40%, #050505 70%, #8d8d8d 100%)',
        shadow: '0 18px 40px rgba(0,0,0,0.34)',
        floatAnim: 'animate-[orbFloatC_5.7s_ease-in-out_infinite]',
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
    setActiveIndex(0);
  }, [type]);

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

  const activePanel = panels[activeIndex];

  return (
    <section className="relative overflow-hidden bg-lifewood-paper">
      <div className="absolute -right-24 top-6 h-72 w-72 rounded-full bg-lifewood-saffron/10 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-lifewood-castleton/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-[34px] bg-lifewood-paper p-6 md:p-10">
          {type === 'D' ? (
            <div className="space-y-10 animate-[fadeUp_700ms_ease-out]">
              <div className="max-w-4xl animate-[fadeUp_850ms_ease-out]">
                <div className="mb-3 inline-flex items-center gap-1.5 text-lifewood-darkSerpent/70">
                  <span className="h-3 w-3 rounded-full bg-black"></span>
                  <span className="h-3 w-3 rounded-full border border-black"></span>
                  <span className="ml-1 block h-px w-24 bg-lifewood-darkSerpent/40"></span>
                </div>
                <h1 className="text-[2.2rem] font-semibold leading-tight text-black md:text-[3.7rem]">
                  AI Generated Content (AIGC)
                </h1>
                <p className="mt-5 max-w-5xl text-[1.02rem] leading-relaxed text-lifewood-darkSerpent/78">
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

              <div className="overflow-hidden rounded-[30px] border border-lifewood-darkSerpent/10 bg-black shadow-2xl animate-[fadeUp_950ms_ease-out]">
                <img
                  src={typeDHeroImage}
                  alt="AIGC hero visual"
                  className="h-[300px] w-full object-cover md:h-[420px]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
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
                          backgroundImage: orb.gradient,
                          boxShadow: orb.shadow,
                        }}
                      />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {type === 'D' && (
          <div className="mb-12 space-y-10 animate-[fadeUp_800ms_ease-out]">
            <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
              <article className="md:col-span-4 pt-2">
                <h2 className="text-xl font-medium text-lifewood-darkSerpent">Our Approach</h2>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-lifewood-darkSerpent/65">
                  Our motivation is to express the personality of your brand in a compelling communication style that stands out.
                </p>
              </article>
              <article className="md:col-span-8">
                <div className="relative mx-auto h-[250px] w-[260px]">
                  <img src={typeDApproachImages[0]} alt="AIGC stack 1" className="absolute left-[44px] top-0 h-[160px] w-[140px] rotate-[16deg] rounded-sm object-cover shadow-xl" />
                  <img src={typeDApproachImages[1]} alt="AIGC stack 2" className="absolute left-[14px] top-[22px] h-[170px] w-[150px] -rotate-[2deg] rounded-sm object-cover shadow-xl" />
                  <img src={typeDApproachImages[2]} alt="AIGC stack 3" className="absolute left-[34px] top-[40px] h-[172px] w-[152px] rounded-sm object-cover shadow-xl" />
                </div>
              </article>
            </section>

            <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
              <article className="md:col-span-4">
                <p className="text-sm leading-relaxed text-lifewood-darkSerpent/78">
                  We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos, advertisements and corporate communications.
                </p>
              </article>
              <article className="md:col-span-8">
                <div className="grid grid-cols-3 gap-2.5">
                  {typeDMiniCards.map((src) => (
                    <div key={src} className="overflow-hidden rounded-md border border-lifewood-darkSerpent/12 bg-white animate-[fadeUp_900ms_ease-out]">
                      <img src={src} alt="AIGC mini card" className="h-24 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="border-t border-lifewood-darkSerpent/15 pt-7">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8 overflow-hidden rounded-md">
                  <img src={typeDBottomLeftImage} alt="AIGC culture and language" className="h-[250px] w-full object-cover" />
                </div>
                <div className="md:col-span-4 grid grid-cols-[1fr_auto] gap-2">
                  <div className="overflow-hidden rounded-md">
                    <img src={typeDBottomRightImage} alt="Multiple languages" className="h-[250px] w-full object-cover" />
                  </div>
                  <div className="self-center rounded-md bg-[#ebebeb] px-3 py-4 text-center">
                    <p className="text-2xl font-extrabold text-lifewood-darkSerpent">100+</p>
                    <p className="text-[0.66rem] uppercase tracking-[0.1em] text-lifewood-darkSerpent/55">Countries</p>
                  </div>
                </div>
              </div>
            </section>

            <blockquote className="max-w-3xl text-sm leading-relaxed text-lifewood-darkSerpent/85">
              “We understand that your customers spend hours looking at screens; so finding the one, most important thing,
              on which to build your message is integral to our approach, as we seek to deliver surprise and originality.”
            </blockquote>
          </div>
        )}

        <div className="mt-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
            <article className="bg-transparent px-2 py-2 lg:col-span-4 lg:min-h-[360px] lg:pr-6">
              <div key={activePanel.id} className="animate-[fadeSlide_540ms_ease]">
                <h2 className="text-[1.7rem] font-medium leading-none text-lifewood-darkSerpent md:text-[2rem]">
                  {String(activeIndex + 1).padStart(2, '0')}
                </h2>
                <h3 className="mt-1.5 text-[1.3rem] font-bold leading-tight text-lifewood-darkSerpent md:text-[1.55rem]">
                  {activePanel.title}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-[1.5] text-lifewood-darkSerpent/76">{activePanel.summary}</p>
                {activePanel.list.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {activePanel.list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[0.83rem] text-lifewood-darkSerpent/78">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lifewood-castleton/90" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[26px] bg-lifewood-darkSerpent lg:col-span-8 lg:min-h-[360px]">
              <img
                key={activePanel.id}
                src={activePanel.image}
                alt={activePanel.title}
                className="h-[240px] w-full animate-[imageReveal_650ms_ease] object-cover md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/35 via-transparent to-lifewood-darkSerpent/25"></div>
              <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/35 bg-black/20 p-1 backdrop-blur-sm">
                  {panels.map((panel, index) => {
                    const active = activeIndex === index;
                    return (
                      <button
                        key={panel.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`rounded-lg px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.11em] transition ${
                          active ? 'bg-white text-lifewood-darkSerpent' : 'text-white/75 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {panel.label.replace('Key Features', 'Solutions')}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 rounded-md bg-black/25 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-sm">
                {activePanel.title}
              </div>
            </article>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
         imageReveal {
          from { opacity: 0.65; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
         fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
         mediaZoom {
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
