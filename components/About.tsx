import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, Target } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

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
      { threshold: 0.12 }
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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const coreValues = [
  {
    letter: 'D',
    title: 'Diversity',
    description:
      'We celebrate differences in belief, philosophy and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.',
  },
  {
    letter: 'C',
    title: 'Caring',
    description: 'We care for every person deeply and equally, because without care work becomes meaningless.',
  },
  {
    letter: 'I',
    title: 'Innovation',
    description:
      'Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.',
  },
  {
    letter: 'I',
    title: 'Integrity',
    description:
      'We are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum. It is the basis of our existence as a company.',
  },
];

const coreValueThemes = [
  {
    frontBg: 'bg-lifewood-darkSerpent',
    frontLetter: 'text-lifewood-saffron',
    frontBorder: 'border-lifewood-castleton/30',
    backBg: 'bg-lifewood-paper',
    backBorder: 'border-lifewood-castleton/30',
    titleColor: 'text-lifewood-darkSerpent',
  },
  {
    frontBg: 'bg-lifewood-castleton',
    frontLetter: 'text-lifewood-paper',
    frontBorder: 'border-lifewood-saffron/45',
    backBg: 'bg-lifewood-seasalt',
    backBorder: 'border-lifewood-castleton/25',
    titleColor: 'text-lifewood-darkSerpent',
  },
  {
    frontBg: 'bg-lifewood-saffron',
    frontLetter: 'text-lifewood-darkSerpent',
    frontBorder: 'border-lifewood-earth/60',
    backBg: 'bg-lifewood-paper',
    backBorder: 'border-lifewood-saffron/40',
    titleColor: 'text-lifewood-darkSerpent',
  },
  {
    frontBg: 'bg-lifewood-darkSerpent',
    frontLetter: 'text-lifewood-earth',
    frontBorder: 'border-lifewood-saffron/40',
    backBg: 'bg-lifewood-seasalt',
    backBorder: 'border-lifewood-castleton/25',
    titleColor: 'text-lifewood-darkSerpent',
  },
];

const About: React.FC = () => {
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-hidden bg-lifewood-paper text-lifewood-darkSerpent">
      <section className="relative bg-lifewood-seasalt py-20 lg:py-24">
        <div className="absolute -left-20 top-14 h-72 w-72 rounded-full bg-lifewood-saffron/10 blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-lifewood-castleton/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <RevealOnScroll>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-lifewood-castleton">Our Company</p>
              <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">About our company</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-lifewood-darkSerpent/75">
                While we are motivated by business and economic objectives, we remain committed to our core business
                beliefs that shape our corporate and individual behaviour around the world.
              </p>
              <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-lifewood-castleton px-6 py-3 text-sm font-bold text-white transition hover:bg-lifewood-darkSerpent">
                Contact Us <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={180}>
            <div className="overflow-hidden rounded-3xl border border-lifewood-darkSerpent/10 shadow-2xl">
              <img
                src="https://framerusercontent.com/images/pi5OJpoXVOCoeElqYLWoXIdGn1U.png?height=1180&width=946"
                alt="Team member working on laptop"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <RevealOnScroll>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-castleton">Core Value</p>
            <h2 className="mt-3 text-4xl font-bold">Lets collaborate</h2>
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
              containerClassName="mt-4"
              textClassName="!text-xl !font-normal !leading-relaxed !text-lifewood-darkSerpent/78"
            >
              At Lifewood we empower our company and our clients to realise the transformative power of AI: Bringing big
              data to life, launching new ways of thinking, innovating, learning, and doing.
            </ScrollReveal>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-lifewood-seasalt py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value, index) => (
              <RevealOnScroll key={value.title} delay={index * 100}>
                {(() => {
                  const theme = coreValueThemes[index % coreValueThemes.length];
                  return (
                <article
                  className="h-full min-h-[280px] rounded-2xl"
                  style={{ perspective: '1200px' }}
                  onMouseEnter={() => setActiveValueIndex(index)}
                  onMouseLeave={() => setActiveValueIndex((current) => (current === index ? null : current))}
                  onFocusCapture={() => setActiveValueIndex(index)}
                  onBlurCapture={() => setActiveValueIndex((current) => (current === index ? null : current))}
                >
                  <div
                    className="relative h-full min-h-[280px] rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: activeValueIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-2xl border shadow-sm ${theme.frontBg} ${theme.frontBorder}`}
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <p className={`text-8xl font-extrabold leading-none tracking-tight ${theme.frontLetter}`}>
                        {value.letter}
                      </p>
                    </div>

                    <div
                      className={`absolute inset-0 rounded-2xl border p-7 shadow-xl ${theme.backBg} ${theme.backBorder}`}
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <p className="text-4xl font-bold text-lifewood-castleton">{value.letter}</p>
                      <h3 className={`mt-3 text-2xl font-bold ${theme.titleColor}`}>{value.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-lifewood-darkSerpent/72">{value.description}</p>
                    </div>
                  </div>
                </article>
                  );
                })()}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lifewood-darkSerpent py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold md:text-4xl">What drives us today, and what inspires us for tomorrow</h2>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RevealOnScroll delay={120}>
              <article className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm">
                <img
                  src="https://framerusercontent.com/images/pqtsyQSdo9BC1b4HN1mpIHnwAA.png?height=1552&width=2780"
                  alt="Mission"
                  className="h-56 w-full object-cover"
                />
                <div className="p-7">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-lifewood-saffron text-lifewood-darkSerpent">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    To develop and deploy cutting edge AI technologies that solve real-world problems, empower
                    communities, and advance sustainable practices.
                  </p>
                </div>
              </article>
            </RevealOnScroll>

            <RevealOnScroll delay={220}>
              <article className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm">
                <img
                  src="https://framerusercontent.com/images/bkXSwutgFfDhSf6t2tQyzrIppzM.jpg?height=1200&width=1200"
                  alt="Vision"
                  className="h-56 w-full object-cover"
                />
                <div className="p-7">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-lifewood-castleton">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    We foster a culture of innovation, collaborate with stakeholders across sectors, and make meaningful
                    impact on society and the environment.
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
