import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BrainCircuit, Cpu, Headset, Mic, ScanEye, ScrollText, ShieldCheck } from 'lucide-react';
import { Page } from '../types';
import Threads from './Threads';
import ScrollReveal from './ScrollReveal';
import SplitText from './SplitText';
import PixelTransition from './PixelTransition';
import GradientText from './GradientText';
import CountUp from './CountUp';

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  stat: { value: number; suffix: string; label: string };
}

const projects: ProjectItem[] = [
  {
    id: '2.1',
    title: 'AI Data Extraction',
    description: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
    icon: <BrainCircuit className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 40, suffix: '+', label: 'Data sources' },
  },
  {
    id: '2.2',
    title: 'Machine Learning Enablement',
    description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model. We provide the infrastructure and annotated datasets required to jumpstart your AI initiatives, reducing time-to-market by up to 40%.',
    icon: <Cpu className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 40, suffix: '%', label: 'Faster to market' },
  },
  {
    id: '2.3',
    title: 'Autonomous Driving Technology',
    description: 'Lifewood supports autonomous driving programs with high-volume, high-precision data operations including collection, labeling, QA, and scenario-specific edge-case handling for ADAS and self-driving models.',
    icon: <ShieldCheck className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 99, suffix: '%', label: 'Label accuracy' },
  },
  {
    id: '2.4',
    title: 'AI-Enabled Customer Service',
    description: 'AI-enabled customer service is now the quickest and most effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. AI powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts AI customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement.',
    icon: <Headset className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 3, suffix: 'x', label: 'Engagement lift' },
  },
  {
    id: '2.5',
    title: 'Natural Language Processing and Speech Acquisition',
    description: "We have partnered with some of the world's most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.",
    icon: <Mic className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 50, suffix: '+', label: 'Languages' },
  },
  {
    id: '2.6',
    title: 'Computer Vision (CV)',
    description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
    icon: <ScanEye className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 10, suffix: 'M+', label: 'Images annotated' },
  },
  {
    id: '2.7',
    title: 'Genealogy',
    description: "Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.",
    icon: <ScrollText className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop',
    stat: { value: 18, suffix: '+', label: 'Years experience' },
  },
];

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

interface ProjectsProps {
  onNavigate: (page: Page) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-lifewood-paper min-h-screen font-sans text-lifewood-darkSerpent">

      {/* ─── HERO WITH THREADS ─── */}
      <section className="relative h-[65vh] min-h-[520px] flex items-center overflow-hidden bg-[#0a0f0d]">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.3]">
          <Threads
            color={[0.016, 0.384, 0.255]}
            amplitude={0.6}
            distance={0.6}
            enableMouseInteraction={false}
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0a0f0d]/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-lifewood-saffron/15 text-lifewood-saffron border border-lifewood-saffron/25 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            Our Portfolio
          </span>
          <div className="mb-6">
            <ScrollReveal
              enableBlur
              baseOpacity={0.1}
              baseRotation={3}
              blurStrength={4}
              textClassName="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight"
            >
              Engineering Intelligence.
            </ScrollReveal>
          </div>
          <div className="max-w-xl border-l-4 border-lifewood-castleton pl-6">
            <SplitText
              text="From building AI datasets in diverse languages and environments to developing platforms that enhance productivity and open new opportunities in under-resourced economies."
              className="text-lg text-white/60 leading-relaxed"
              delay={0.02}
              duration={0.5}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 16 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── PROJECT SHOWCASE GRID ─── */}
      <section className="py-24 bg-lifewood-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {projects.map((project, index) => {
              const isReversed = index % 2 === 1;
              const Icon = project.icon;

              return (
                <RevealOnScroll key={project.id} delay={index * 60}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${isReversed ? 'lg:[direction:rtl]' : ''}`}>
                    {/* PixelTransition image card */}
                    <div className={`${isReversed ? 'lg:[direction:ltr]' : ''}`}>
                      <PixelTransition
                        firstContent={
                          <div className="relative w-full h-full">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-lifewood-saffron/15 border border-lifewood-saffron/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lifewood-saffron backdrop-blur-md">
                                Project {project.id}
                              </span>
                            </div>
                          </div>
                        }
                        secondContent={
                          <div className="flex h-full w-full items-center justify-center bg-[#0d1f17] p-8 text-center">
                            <div>
                              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lifewood-castleton">
                                {React.cloneElement(Icon as React.ReactElement<{ className?: string }>, {
                                  className: 'w-6 h-6 text-white',
                                })}
                              </div>
                              <p className="text-2xl font-extrabold text-lifewood-saffron">
                                <CountUp to={project.stat.value} duration={0.8} />
                                {project.stat.suffix}
                              </p>
                              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                                {project.stat.label}
                              </p>
                              <p className="mt-4 text-sm leading-relaxed text-white/70">
                                Hover to read more
                              </p>
                            </div>
                          </div>
                        }
                        gridSize={8}
                        pixelColor="#0d1f17"
                        animationStepDuration={0.3}
                        aspectRatio="56%"
                        className="rounded-2xl overflow-hidden shadow-2xl border border-lifewood-darkSerpent/10"
                      />
                    </div>

                    {/* Content */}
                    <div className={`${isReversed ? 'lg:[direction:ltr]' : ''}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lifewood-castleton/10">
                          {React.cloneElement(Icon as React.ReactElement<{ className?: string }>, {
                            className: 'w-5 h-5 text-lifewood-castleton',
                          })}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lifewood-castleton/60">
                          Project {project.id}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-lifewood-darkSerpent leading-tight mb-4">
                        {project.title}
                      </h3>
                      <div className="h-1 w-12 rounded-full bg-lifewood-saffron mb-5" />
                      <p className="text-base leading-relaxed text-lifewood-darkSerpent/70 whitespace-pre-line">
                        {project.description}
                      </p>
                      <div className="mt-6 flex items-center gap-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-lifewood-castleton">
                            <CountUp to={project.stat.value} duration={0.8} />
                          </span>
                          <span className="text-lg font-bold text-lifewood-castleton">{project.stat.suffix}</span>
                          <span className="ml-2 text-xs font-medium uppercase tracking-wide text-lifewood-darkSerpent/50">{project.stat.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA WITH GRADIENT TEXT ─── */}
      <section className="relative overflow-hidden bg-[#0a0f0d] py-28 border-t border-white/8">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.2]">
          <Threads
            color={[1.0, 0.702, 0.278]}
            amplitude={0.3}
            distance={1.0}
            enableMouseInteraction={false}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <ScrollReveal
              enableBlur
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={3}
              textClassName="text-3xl md:text-5xl font-bold text-white"
            >
              Ready to start your project?
            </ScrollReveal>
          </div>
          <p className="text-lifewood-paper/50 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Our team of engineers and data specialists are ready to integrate with your workflow. Experience the precision of Lifewood&apos;s data engine.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => onNavigate(Page.CONTACT)}
              className="group inline-flex items-center gap-2 rounded-full bg-lifewood-saffron px-10 py-4 font-bold text-lifewood-darkSerpent shadow-xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105"
            >
              Get in Touch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <GradientText
              className="text-sm font-semibold uppercase tracking-[0.15em]"
              colors={['#046241', '#FFB347', '#FFC370', '#046241']}
              animationSpeed={8}
              direction="horizontal"
            >
              Engineering the future of data
            </GradientText>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
