import React, { useEffect, useRef, useState } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountUp from './CountUp';
import Threads from './Threads';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */

const modalityItems = [
  {
    title: 'Text',
    description: 'Collection, labelling, transcription, sentiment analysis.',
    icon: FileText,
    image: 'https://images.pexels.com/photos/5402677/pexels-photo-5402677.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Video',
    description: 'Collection, labelling, audit, subtitle generation.',
    icon: Video,
    image: 'https://images.pexels.com/photos/28955773/pexels-photo-28955773.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Image',
    description: 'Collection, labelling, classification, object detection.',
    icon: ImageIcon,
    image: 'https://images.pexels.com/photos/30670962/pexels-photo-30670962.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Audio',
    description: 'Collection, labelling, voice categorization.',
    icon: Mic,
    image: 'https://images.pexels.com/photos/4988132/pexels-photo-4988132.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const capabilities = [
  {
    title: 'Data Processing',
    description: 'High-volume and high-accuracy annotation pipelines with strict QA controls.',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 200, suffix: '+', label: 'Projects Delivered' },
  },
  {
    title: 'Intelligent Virtual Assistants',
    description: 'Conversational AI systems for support, operations, and internal knowledge workflows.',
    image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 50, suffix: '+', label: 'Languages' },
  },
  {
    title: 'Global Data Library',
    description: 'Ethically sourced multilingual datasets for training robust and inclusive models.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 30, suffix: '+', label: 'Countries' },
  },
  {
    title: 'ESG-Driven Workforce',
    description: 'Inclusive talent operations designed to scale data production with social impact.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 56000, suffix: '+', label: 'Online Resources', separator: ',' },
  },
  {
    title: 'Data Security & Compliance',
    description: 'Enterprise-grade governance, privacy, and compliance safeguards across engagements.',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 40, suffix: '+', label: 'Delivery Centers' },
  },
  {
    title: 'AI Strategy & Consulting',
    description: 'Practical adoption roadmaps from pilot to production for sustainable AI delivery.',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=900',
    stat: { value: 99, suffix: '%', label: 'Client Retention' },
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

/* ── Component ── */

const Services: React.FC = () => {
  const [activeMethodIndex, setActiveMethodIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const modalityRef = useRef<HTMLDivElement>(null);
  const capGridRef = useRef<HTMLDivElement>(null);

  /* ── Hero parallax: image drifts slower than text ── */
  useEffect(() => {
    const hero = heroRef.current;
    const img = heroImageRef.current;
    const text = heroTextRef.current;
    if (!hero || !img || !text) return;

    const ctx = gsap.context(() => {
      gsap.to(img, {
        y: 80,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(text, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, hero);
    return () => ctx.revert();
  }, []);

  /* ── Modality cards stagger ── */
  useEffect(() => {
    const el = modalityRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.modality-card'), {
        y: 60,
        opacity: 0,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  /* ── Capability cards: alternating slide-in ── */
  useEffect(() => {
    const grid = capGridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      grid.querySelectorAll('.cap-card').forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        });
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-lifewood-paper">
      {/* ═══ HERO ═══ */}
      <div ref={heroRef} className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <img
          ref={heroImageRef}
          src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Forest canopy"
          className="absolute inset-0 h-[120%] w-full object-cover"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lifewood-darkSerpent/60 via-lifewood-darkSerpent/40 to-lifewood-darkSerpent/80" />
        <div
          ref={heroTextRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ willChange: 'transform' }}
        >
          <span className="mb-4 text-xs font-extrabold uppercase tracking-[0.3em] text-lifewood-saffron md:text-sm">
            Our Capabilities
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.08] text-white md:text-6xl lg:text-7xl">
            Empowering the{' '}
            <span className="bg-gradient-to-r from-lifewood-saffron to-lifewood-earth bg-clip-text text-transparent">
              AI Revolution
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            We deliver the data fuel and strategic framework required to build world-class AI models, bridging the gap between raw data and actionable intelligence.
          </p>
        </div>
      </div>

      {/* ═══ MODALITY STRIP ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center text-xs font-extrabold uppercase tracking-[0.25em] text-lifewood-castleton/70">
          Multi-Modal Data Expertise
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-2xl font-bold text-lifewood-darkSerpent md:text-3xl">
          We work across every data type your AI needs.
        </p>
        <div ref={modalityRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modalityItems.map((item) => (
            <div
              key={item.title}
              className="modality-card group relative overflow-hidden rounded-2xl border border-lifewood-darkSerpent/8 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lifewood-darkSerpent/50 to-transparent" />
                <div className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 shadow-md backdrop-blur-sm transition-colors duration-300 group-hover:bg-lifewood-castleton">
                  <item.icon className="h-4 w-4 text-lifewood-darkSerpent transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-lifewood-darkSerpent">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-lifewood-darkSerpent/65">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ VIDEO ═══ */}
      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-lifewood-darkSerpent/10 bg-black shadow-2xl">
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

      {/* ═══ CAPABILITIES — PARALLAX CARDS ═══ */}
      <div className="relative overflow-hidden bg-[#0a0f0d] py-24">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <Threads
            color={[0.016, 0.384, 0.255]}
            amplitude={0.3}
            distance={0.6}
            enableMouseInteraction={false}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-center text-xs font-extrabold uppercase tracking-[0.25em] text-lifewood-saffron/80">
            What We Deliver
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-2xl font-bold text-white md:text-3xl">
            End-to-end AI data capabilities at global scale.
          </p>

          <div ref={capGridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="cap-card group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur-sm transition-all duration-500 hover:border-lifewood-saffron/25 hover:bg-white/[0.07]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cap.image}
                    alt={cap.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/40 to-transparent" />
                  <div className="absolute bottom-3 right-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-lifewood-saffron">
                      <CountUp to={cap.stat.value} duration={0.8} separator={cap.stat.separator || ''} />
                      {cap.stat.suffix}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{cap.stat.label}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{cap.description}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-lifewood-saffron to-lifewood-earth transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ METHODOLOGY ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-lifewood-darkSerpent/5 bg-white p-8 shadow-xl md:p-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-lifewood-darkSerpent">Our Proven Methodology</h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-lifewood-saffron" />
          </div>
          <div className="space-y-3">
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
                        <p className="text-sm leading-relaxed text-lifewood-darkSerpent/72">{step.summary}</p>
                        <p className="mt-2 text-sm leading-relaxed text-lifewood-darkSerpent/66">{step.detail}</p>
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
      </div>
    </section>
  );
};

export default Services;
