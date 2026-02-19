import React, { useEffect, useRef, useState } from 'react';
import { 
  Database, 
  FileText, Video, Image as ImageIcon, Mic, CheckCircle, Globe, Filter, PenTool, ChevronDown 
} from 'lucide-react';
import MagicBento from './MagicBento';

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

const modalityItems = [
  {
    title: 'Text',
    description: 'Collection, labelling, transcription, sentiment analysis.',
    icon: FileText,
    image:
      'https://picsum.photos/seed/lw-modality-text/1200/700',
  },
  {
    title: 'Video',
    description: 'Collection, labelling, audit, subtitle generation.',
    icon: Video,
    image:
      'https://picsum.photos/seed/lw-modality-video/1200/700',
  },
  {
    title: 'Image',
    description: 'Collection, labelling, classification, object detection.',
    icon: ImageIcon,
    image:
      'https://picsum.photos/seed/lw-modality-image/1200/700',
  },
  {
    title: 'Audio',
    description: 'Collection, labelling, voice categorization.',
    icon: Mic,
    image:
      'https://picsum.photos/seed/lw-modality-audio/1200/700',
  },
];
const marqueeModalityItems = [...modalityItems, ...modalityItems, ...modalityItems];

const bentoCards = [
  {
    color: '#0d1f17',
    title: 'Data Processing',
    description: 'High-volume and high-accuracy annotation pipelines with strict QA controls.',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Intelligent Virtual Assistants',
    description: 'Conversational AI systems for support, operations, and internal knowledge workflows.',
    image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Global Data Library',
    description: 'Ethically sourced multilingual datasets for training robust and inclusive models.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'ESG-Driven Workforce',
    description: 'Inclusive talent operations designed to scale data production with social impact.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Data Security & Compliance',
    description: 'Enterprise-grade governance, privacy, and compliance safeguards across engagements.',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'AI Strategy & Consulting',
    description: 'Practical adoption roadmaps from pilot to production for sustainable AI delivery.',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
];

const methodologySteps = [
  {
    id: '1',
    title: 'Data Validation',
    summary: 'Ensuring consistency, accuracy, and completeness against project standards.',
    detail:
      'Every dataset passes structured QA checks, edge-case review, and policy conformity before moving to production-ready pipelines.',
    outcome: 'Higher model reliability',
    icon: CheckCircle,
  },
  {
    id: '2',
    title: 'Data Collection',
    summary: 'Scalable multi-modal collection across text, audio, image, and video.',
    detail:
      'Collection frameworks are localized per language and region to preserve context while maintaining uniform annotation quality.',
    outcome: 'Broader real-world coverage',
    icon: Globe,
  },
  {
    id: '3',
    title: 'Data Acquisition',
    summary: 'End-to-end capture, ingestion, and structured management of diverse datasets.',
    detail:
      'Data is normalized, versioned, and securely routed to AI workflows with full traceability for enterprise governance.',
    outcome: 'Faster onboarding to training',
    icon: Database,
  },
  {
    id: '4',
    title: 'Data Curation',
    summary: 'Sifting, selecting, and indexing high-value samples for model performance.',
    detail:
      'Curation removes noisy examples, balances underrepresented cases, and improves dataset fitness for targeted ML outcomes.',
    outcome: 'Cleaner signal, less model drift',
    icon: Filter,
  },
  {
    id: '5',
    title: 'Data Annotation',
    summary: 'Precision labeling for computer vision and advanced NLP pipelines.',
    detail:
      'Human-in-the-loop annotation with calibrated guidelines ensures labeling consistency at enterprise scale.',
    outcome: 'Production-grade training data',
    icon: PenTool,
  },
];

const Services: React.FC = () => {
  const [activeMethodIndex, setActiveMethodIndex] = useState(0);

  return (
    <section className="bg-lifewood-paper min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-lifewood-saffron/10 to-transparent rounded-full blur-3xl opacity-50 -mr-32 -mt-32 pointer-events-none animate-float"></div>
      <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-lifewood-castleton/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '900ms' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12">
        <RevealOnScroll>
          <div className="relative text-center mb-20 overflow-hidden rounded-3xl border border-lifewood-darkSerpent/10 shadow-lg">
            <img
              src="https://picsum.photos/seed/lw-services-hero/2000/1100"
              alt="Team delivering AI data services"
              className="h-[280px] md:h-[360px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent/85 via-lifewood-darkSerpent/70 to-lifewood-darkSerpent/35"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <span className="text-lifewood-saffron font-extrabold uppercase tracking-widest text-xs mb-4 block">Our Capabilities</span>
              <h2 className="font-sans text-4xl md:text-5xl font-extrabold text-white mb-4">
                Empowering the <span className="text-lifewood-saffron">AI Revolution</span>
              </h2>
              <p className="text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                We deliver the data fuel and strategic framework required to build world-class AI models, bridging the gap between raw data and actionable intelligence.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mb-24">
          <RevealOnScroll>
            <h3 className="text-2xl font-bold text-lifewood-darkSerpent mb-8 text-center">Multi-Modal Data Expertise</h3>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="marquee-wrap overflow-hidden bg-transparent py-2">
              <div className="marquee-track flex w-max items-stretch gap-6 px-1">
                {marqueeModalityItems.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="group min-w-[300px] max-w-[300px] rounded-xl border border-lifewood-grey-light bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-lifewood-castleton/30 hover:shadow-xl"
                  >
                  <div className="h-28 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.title} data service`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/45 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 bg-lifewood-seasalt rounded-lg flex items-center justify-center mb-4 group-hover:bg-lifewood-castleton transition-colors">
                      <item.icon className="w-5 h-5 text-lifewood-darkSerpent group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-lifewood-darkSerpent mb-2">{item.title}</h3>
                    <p className="text-sm text-lifewood-darkSerpent/70 leading-relaxed">{item.description}</p>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mb-24">
          <RevealOnScroll delay={90}>
            <div className="mb-10">
              <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-lifewood-darkSerpent/10 bg-black shadow-lg">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube.com/embed/g_JvAVL0WY4?rel=0&modestbranding=1"
                    title="Lifewood AI Data Services"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <MagicBento
              textAutoHide
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt={false}
              enableMagnetism={false}
              clickEffect
              spotlightRadius={400}
              particleCount={12}
              glowColor="255, 179, 71"
              disableAnimations={false}
              cards={bentoCards}
            />
          </RevealOnScroll>
        </div>

        <RevealOnScroll>
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-lifewood-darkSerpent/5">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-lifewood-darkSerpent mb-4">Our Proven Methodology</h2>
              <div className="w-24 h-1 bg-lifewood-saffron mx-auto rounded-full"></div>
            </div>
            <div className="space-y-4">
              {methodologySteps.map((step, index) => {
                const isActive = index === activeMethodIndex;
                return (
                  <article
                    key={step.id}
                    onMouseEnter={() => setActiveMethodIndex(index)}
                    className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? 'border-lifewood-castleton/30 bg-lifewood-seasalt shadow-lg'
                        : 'border-transparent bg-lifewood-seasalt/70 hover:border-lifewood-castleton/20 hover:shadow-md'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMethodIndex(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isActive}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-white text-lifewood-castleton shadow-sm flex items-center justify-center">
                          <step.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-[0.2em] text-lifewood-castleton/80 mb-1">{step.id}</p>
                          <h4 className="text-lg font-bold text-lifewood-darkSerpent">{step.title}</h4>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-lifewood-darkSerpent/55 transition-transform duration-300 ${
                          isActive ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 -mt-1">
                          <p className="text-sm text-lifewood-darkSerpent/72 leading-relaxed mb-3">{step.summary}</p>
                          <p className="text-sm text-lifewood-darkSerpent/66 leading-relaxed">{step.detail}</p>
                          <div className="mt-4 inline-flex items-center rounded-full border border-lifewood-castleton/20 bg-white px-3 py-1 text-xs font-semibold text-lifewood-castleton">
                            Outcome: {step.outcome}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};

export default Services;
