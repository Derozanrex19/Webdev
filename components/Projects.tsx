import React, { useRef, useState } from 'react';
import { ArrowRight, BrainCircuit, Cpu, Headset, Mic, ScanEye, ScrollText, ShieldCheck } from 'lucide-react';
import { Page } from '../types';
import Threads from './Threads';
import ScrollReveal from './ScrollReveal';
import SplitText from './SplitText';
import GradientText from './GradientText';
import CountUp from './CountUp';
import CardSwap, { Card, type CardSwapHandle } from './CardSwap';

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

const ProjectShowcase: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swapRef = useRef<CardSwapHandle>(null);

  const handleSelect = (i: number) => {
    setActiveIndex(i);
    swapRef.current?.swapTo(i);
  };

  return (
    <section className="bg-lifewood-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left: active project details */}
          <div className="relative order-2 lg:order-1">
            {projects.map((project, i) => {
              const Icon = project.icon;
              return (
                <div
                  key={project.id}
                  className={`transition-all duration-500 ${
                    activeIndex === i
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none absolute inset-0 opacity-0'
                  }`}
                  aria-hidden={activeIndex !== i}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lifewood-castleton/10">
                      {React.cloneElement(Icon as React.ReactElement<{ className?: string }>, {
                        className: 'w-5 h-5 text-lifewood-castleton',
                      })}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lifewood-castleton/60">
                      Project {project.id}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold leading-tight text-lifewood-darkSerpent md:text-3xl">
                    {project.title}
                  </h3>
                  <div className="mb-4 h-1 w-12 rounded-full bg-lifewood-saffron" />
                  <p className="text-sm leading-relaxed text-lifewood-darkSerpent/70 md:text-base">
                    {project.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-lifewood-castleton">
                      <CountUp to={project.stat.value} duration={0.8} />
                    </span>
                    <span className="text-lg font-bold text-lifewood-castleton">{project.stat.suffix}</span>
                    <span className="ml-2 text-xs font-medium uppercase tracking-wide text-lifewood-darkSerpent/50">
                      {project.stat.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Project selector pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {projects.map((project, i) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => handleSelect(i)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeIndex === i
                      ? 'bg-lifewood-castleton text-white shadow-md'
                      : 'border border-lifewood-darkSerpent/12 bg-white text-lifewood-darkSerpent/60 hover:border-lifewood-castleton/30 hover:text-lifewood-castleton'
                  }`}
                >
                  {project.id}
                </button>
              ))}
            </div>
          </div>

          {/* Right: CardSwap animation */}
          <div className="relative order-1 h-[480px] lg:order-2 lg:h-[550px]">
            <CardSwap
              ref={swapRef}
              cardDistance={50}
              verticalDistance={55}
              width={460}
              height={340}
              skewAmount={4}
              easing="elastic"
              onFrontChange={(i) => setActiveIndex(i)}
            >
              {projects.map((project) => (
                <Card key={project.id}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-[60%] w-full object-cover"
                  />
                  <div className="flex h-[40%] flex-col justify-center px-6">
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-lifewood-castleton/60">
                      Project {project.id}
                    </span>
                    <h4 className="text-lg font-bold text-lifewood-darkSerpent">{project.title}</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-lifewood-castleton">
                        {project.stat.value}{project.stat.suffix}
                      </span>
                      <span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-lifewood-darkSerpent/45">
                        {project.stat.label}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
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

      {/* ─── PROJECT SHOWCASE — CARD SWAP ─── */}
      <ProjectShowcase projects={projects} />

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
