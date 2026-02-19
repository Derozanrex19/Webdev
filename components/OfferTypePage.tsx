import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

type OfferTypeKey = 'A' | 'B' | 'C' | 'D';

interface OfferTypePageProps {
  type: OfferTypeKey;
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
    subtitle: 'AI-generated and AI-assisted content production frameworks.',
    objective:
      'Create scalable content systems for training, testing, and deployment that combine AI generation with editorial control.',
    features: [
      'Prompt libraries and synthetic data generation',
      'Human editorial loops for style and factual integrity',
      'Structured evaluation datasets for model benchmarking',
      'Production-ready pipelines for continuous content operations',
    ],
    results: [
      'Faster content throughput with quality guardrails',
      'Reusable assets for ongoing model iteration',
      'Lower cost per high-quality content unit',
    ],
    image: 'https://images.pexels.com/photos/8438919/pexels-photo-8438919.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    objectiveImage: 'https://images.pexels.com/photos/8438921/pexels-photo-8438921.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    featuresImage: 'https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
    resultsImage: 'https://images.pexels.com/photos/8438950/pexels-photo-8438950.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop&dpr=2',
  },
};

const OfferTypePage: React.FC<OfferTypePageProps> = ({ type }) => {
  const content = offerContent[type];
  const [activeIndex, setActiveIndex] = useState(0);

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

  const activePanel = panels[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#efefef]">
      <div className="absolute -right-24 top-6 h-72 w-72 rounded-full bg-lifewood-saffron/10 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-lifewood-castleton/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="group relative mb-12 overflow-hidden rounded-3xl border border-lifewood-darkSerpent/10 bg-white shadow-xl">
          <img
            src={content.image}
            alt={content.title}
            className="h-[260px] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 md:h-[360px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent/90 via-lifewood-darkSerpent/70 to-lifewood-darkSerpent/25"></div>
          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <div className="max-w-3xl transition-all duration-700 ease-out">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-lifewood-saffron backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> What We Offer
              </p>
              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">{content.title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">{content.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
            <article className="bg-transparent px-2 py-2 lg:col-span-4 lg:min-h-[360px] lg:pr-6">
              <div key={activePanel.id} className="animate-[fadeSlide_540ms_ease]">
                <h2 className="text-[1.7rem] font-medium leading-none text-lifewood-darkSerpent md:text-[2rem]">{String(activeIndex + 1).padStart(2, '0')}</h2>
                <h3 className="mt-1.5 text-[1.3rem] font-bold leading-tight text-lifewood-darkSerpent md:text-[1.55rem]">{activePanel.title}</h3>
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
        @keyframes imageReveal {
          from { opacity: 0.65; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default OfferTypePage;
