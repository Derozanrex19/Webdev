import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Database,
  FileText,
  Video,
  Image as ImageIcon,
  Mic,
  CheckCircle,
  Globe,
  Filter,
  PenTool,
  ChevronDown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TiltSpotlightCard — 3D perspective tilt + mouse spotlight
   Pure CSS transforms, GPU composited, zero dependencies
   ═══════════════════════════════════════════════════════════ */

interface TiltSpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  perspective?: number;
  spotlightSize?: number;
  spotlightColor?: string;
  spotlightOpacity?: number;
  scaleOnHover?: number;
  borderGlow?: boolean;
}

const TiltSpotlightCard: React.FC<TiltSpotlightCardProps> = ({
  children,
  className = '',
  tiltIntensity = 12,
  perspective = 1000,
  spotlightSize = 350,
  spotlightColor = '255, 179, 71',
  spotlightOpacity = 0.12,
  scaleOnHover = 1.02,
  borderGlow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      const spotlight = spotlightRef.current;
      const border = borderRef.current;
      if (!card) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * tiltIntensity;
        const rotateX = ((centerY - y) / centerY) * tiltIntensity;

        card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`;

        if (spotlight) {
          spotlight.style.background = `radial-gradient(${spotlightSize}px circle at ${x}px ${y}px, rgba(${spotlightColor}, ${spotlightOpacity}), transparent 60%)`;
          spotlight.style.opacity = '1';
        }

        if (border && borderGlow) {
          border.style.background = `radial-gradient(${spotlightSize * 0.8}px circle at ${x}px ${y}px, rgba(${spotlightColor}, 0.35), transparent 60%)`;
          border.style.opacity = '1';
        }
      });
    },
    [tiltIntensity, perspective, scaleOnHover, spotlightSize, spotlightColor, spotlightOpacity, borderGlow]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    const border = borderRef.current;
    if (card) card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (spotlight) spotlight.style.opacity = '0';
    if (border) border.style.opacity = '0';
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-transform duration-300 ease-out ${className}`}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
      {/* Border glow overlay */}
      {borderGlow && (
        <div
          ref={borderRef}
          className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '1px' }}
        />
      )}
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RevealOnScroll
   ═══════════════════════════════════════════════════════════ */

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
      ([entry]) => { setIsVisible(entry.isIntersecting); },
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

/* ═══════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════ */

const modalityItems = [
  { title: 'Text', description: 'Collection, labelling, transcription, sentiment analysis.', icon: FileText, image: 'https://images.pexels.com/photos/5402677/pexels-photo-5402677.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Video', description: 'Collection, labelling, audit, subtitle generation.', icon: Video, image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Image', description: 'Collection, labelling, classification, object detection.', icon: ImageIcon, image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Audio', description: 'Collection, labelling, voice categorization.', icon: Mic, image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=800' },
];
const marqueeModalityItems = [...modalityItems, ...modalityItems, ...modalityItems];

const capabilityCards = [
  { title: 'Data Processing', description: 'High-volume and high-accuracy annotation pipelines with strict QA controls.', image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Intelligent Virtual Assistants', description: 'Conversational AI systems for support, operations, and internal knowledge workflows.', image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Global Data Library', description: 'Ethically sourced multilingual datasets for training robust and inclusive models.', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'ESG-Driven Workforce', description: 'Inclusive talent operations designed to scale data production with social impact.', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Data Security & Compliance', description: 'Enterprise-grade governance, privacy, and compliance safeguards across engagements.', image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'AI Strategy & Consulting', description: 'Practical adoption roadmaps from pilot to production for sustainable AI delivery.', image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

const methodologySteps = [
  { id: '1', title: 'Data Validation', summary: 'Ensuring consistency, accuracy, and completeness against project standards.', detail: 'Every dataset passes structured QA checks, edge-case review, and policy conformity before moving to production-ready pipelines.', outcome: 'Higher model reliability', icon: CheckCircle },
  { id: '2', title: 'Data Collection', summary: 'Scalable multi-modal collection across text, audio, image, and video.', detail: 'Collection frameworks are localized per language and region to preserve context while maintaining uniform annotation quality.', outcome: 'Broader real-world coverage', icon: Globe },
  { id: '3', title: 'Data Acquisition', summary: 'End-to-end capture, ingestion, and structured management of diverse datasets.', detail: 'Data is normalized, versioned, and securely routed to AI workflows with full traceability for enterprise governance.', outcome: 'Faster onboarding to training', icon: Database },
  { id: '4', title: 'Data Curation', summary: 'Sifting, selecting, and indexing high-value samples for model performance.', detail: 'Curation removes noisy examples, balances underrepresented cases, and improves dataset fitness for targeted ML outcomes.', outcome: 'Cleaner signal, less model drift', icon: Filter },
  { id: '5', title: 'Data Annotation', summary: 'Precision labeling for computer vision and advanced NLP pipelines.', detail: 'Human-in-the-loop annotation with calibrated guidelines ensures labeling consistency at enterprise scale.', outcome: 'Production-grade training data', icon: PenTool },
];

/* ═══════════════════════════════════════════════════════════
   Services Page
   ═══════════════════════════════════════════════════════════ */

const Services: React.FC = () => {
  const [activeMethodIndex, setActiveMethodIndex] = useState(0);

  return (
    <section className="relative min-h-screen overflow-hidden bg-lifewood-paper">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] animate-float rounded-full bg-gradient-to-b from-lifewood-saffron/10 to-transparent blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-[420px] w-[420px] animate-float rounded-full bg-lifewood-castleton/10 blur-3xl" style={{ animationDelay: '900ms' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        {/* ═══ HERO ═══ */}
        <RevealOnScroll>
          <div className="relative mb-20 overflow-hidden rounded-3xl border border-lifewood-darkSerpent/10 text-center shadow-lg">
            <img
              src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Forest canopy"
              className="h-[280px] w-full object-cover md:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent/85 via-lifewood-darkSerpent/70 to-lifewood-darkSerpent/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <span className="mb-4 block text-xs font-extrabold uppercase tracking-widest text-lifewood-saffron">Our Capabilities</span>
              <h2 className="mb-4 font-sans text-4xl font-extrabold text-white md:text-5xl">
                Empowering the <span className="text-lifewood-saffron">AI Revolution</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                We deliver the data fuel and strategic framework required to build world-class AI models, bridging the gap between raw data and actionable intelligence.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* ═══ MODALITY MARQUEE ═══ */}
        <div className="mb-24">
          <RevealOnScroll>
            <h3 className="mb-8 text-center text-2xl font-bold text-lifewood-darkSerpent">Multi-Modal Data Expertise</h3>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <div className="marquee-wrap overflow-hidden bg-transparent py-2">
              <div className="marquee-track flex w-max items-stretch gap-6 px-1">
                {marqueeModalityItems.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="group min-w-[300px] max-w-[300px] rounded-xl border border-lifewood-grey-light bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-lifewood-castleton/30 hover:shadow-xl"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.title} data service`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/45 to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-lifewood-seasalt transition-colors group-hover:bg-lifewood-castleton">
                        <item.icon className="h-5 w-5 text-lifewood-darkSerpent group-hover:text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-lifewood-darkSerpent">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-lifewood-darkSerpent/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* ═══ VIDEO ═══ */}
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

          {/* ═══ CAPABILITY CARDS — 3D TILT + SPOTLIGHT ═══ */}
          <RevealOnScroll delay={120}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityCards.map((card, i) => (
                <TiltSpotlightCard
                  key={card.title}
                  className="rounded-2xl border border-lifewood-darkSerpent/8 bg-white shadow-sm"
                  tiltIntensity={10}
                  spotlightColor="4, 98, 65"
                  spotlightOpacity={0.08}
                  spotlightSize={300}
                  scaleOnHover={1.03}
                >
                  <div className="group relative overflow-hidden rounded-2xl">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    </div>
                    <div className="relative z-10 p-5">
                      <h4 className="text-lg font-bold text-lifewood-darkSerpent">{card.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-lifewood-darkSerpent/65">{card.description}</p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-lifewood-castleton to-lifewood-saffron transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                </TiltSpotlightCard>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        {/* ═══ METHODOLOGY ═══ */}
        <RevealOnScroll>
          <div className="rounded-3xl border border-lifewood-darkSerpent/5 bg-white p-10 shadow-xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-lifewood-darkSerpent">Our Proven Methodology</h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-lifewood-saffron" />
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lifewood-castleton shadow-sm">
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-[0.2em] text-lifewood-castleton/80">{step.id}</p>
                          <h4 className="text-lg font-bold text-lifewood-darkSerpent">{step.title}</h4>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-lifewood-darkSerpent/55 transition-transform duration-300 ${
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
                        <div className="-mt-1 px-5 pb-5">
                          <p className="mb-3 text-sm leading-relaxed text-lifewood-darkSerpent/72">{step.summary}</p>
                          <p className="text-sm leading-relaxed text-lifewood-darkSerpent/66">{step.detail}</p>
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
