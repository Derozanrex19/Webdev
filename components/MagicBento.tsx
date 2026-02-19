import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

interface MagicBentoCardData {
  color: string;
  title: string;
  description: string;
  label?: string;
  image?: string;
}

const defaultCardData: MagicBentoCardData[] = [
  {
    color: '#0d1f17',
    title: 'Data Processing',
    description: 'High-accuracy annotation and large-scale processing.',
    label: 'AI Data',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Virtual Assistants',
    description: 'Conversational AI agents for support and operations.',
    label: 'NLP',
    image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Global Data Library',
    description: 'Diverse multilingual datasets for model training.',
    label: 'Datasets',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'ESG Workforce',
    description: 'Inclusive hiring and socially driven data operations.',
    label: 'Impact',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'Security & Compliance',
    description: 'Enterprise-grade controls for privacy and governance.',
    label: 'Security',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
  {
    color: '#0d1f17',
    title: 'AI Strategy',
    description: 'Roadmap and implementation guidance for AI programs.',
    label: 'Consulting',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&dpr=2',
  },
];

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  cards?: MagicBentoCardData[];
}

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const element = document.createElement('div');
  element.className = 'magic-bento-particle';
  element.style.cssText = `
    position:absolute;width:4px;height:4px;border-radius:9999px;
    background:rgba(${color},1);box-shadow:0 0 8px rgba(${color},0.6);
    pointer-events:none;z-index:20;left:${x}px;top:${y}px;
  `;
  return element;
};

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'back.in(1.7)',
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
      }, index * 90);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;
    const imageElement = element.querySelector<HTMLElement>('.magic-bento-card__image');
    const mediaElement = element.querySelector<HTMLElement>('.magic-bento-card__media');
    const contentElement = element.querySelector<HTMLElement>('.magic-bento-card__content');

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      gsap.to(element, { '--sheen-progress': 1, duration: 0.75, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(element, { '--sheen-progress': 0, duration: 0.45, ease: 'power2.out' });
      if (imageElement) gsap.to(imageElement, { x: 0, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' });
      if (mediaElement) gsap.to(mediaElement, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
      if (contentElement) gsap.to(contentElement, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = (x - centerX) / centerX;
      const offsetY = (y - centerY) / centerY;
      element.style.setProperty('--cursor-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--cursor-y', `${(y / rect.height) * 100}%`);

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(element, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04;
        const magnetY = (y - centerY) * 0.04;
        gsap.to(element, { x: magnetX, y: magnetY, duration: 0.2, ease: 'power2.out' });
      }

      if (imageElement) {
        gsap.to(imageElement, {
          x: offsetX * 10,
          y: offsetY * 10,
          scale: 1.07,
          duration: 0.28,
          ease: 'power2.out',
        });
      }
      if (mediaElement) {
        gsap.to(mediaElement, {
          x: offsetX * 4,
          y: offsetY * 4,
          duration: 0.28,
          ease: 'power2.out',
        });
      }
      if (contentElement) {
        gsap.to(contentElement, {
          x: offsetX * -2,
          y: offsetY * -2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute;width:${maxDistance * 2}px;height:${maxDistance * 2}px;border-radius:9999px;
        background:radial-gradient(circle, rgba(${glowColor},0.4) 0%, rgba(${glowColor},0.2) 30%, transparent 70%);
        left:${x - maxDistance}px;top:${y - maxDistance}px;pointer-events:none;z-index:30;
      `;
      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={`${className} magic-bento-particle-container`} style={{ ...style, position: 'relative' }}>
      {children}
    </div>
  );
};

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const GlobalSpotlight: React.FC<GlobalSpotlightProps> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'magic-bento-global-spotlight';
    spotlight.style.cssText = `
      position:fixed;width:700px;height:700px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle, rgba(${glowColor},0.2) 0%, rgba(${glowColor},0.08) 22%, rgba(${glowColor},0.02) 44%, transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const sectionRect = gridRef.current.getBoundingClientRect();
      const inside =
        event.clientX >= sectionRect.left &&
        event.clientX <= sectionRect.right &&
        event.clientY >= sectionRect.top &&
        event.clientY <= sectionRect.bottom;

      const cards = gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card');

      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' });
        cards.forEach((card) => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        const glow = distance <= spotlightRadius ? 1 - distance / spotlightRadius : 0;
        updateCardGlowProperties(card, event.clientX, event.clientY, Math.max(glow, 0), spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: event.clientX, top: event.clientY, opacity: 0.8, duration: 0.12, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      if (!spotlightRef.current || !gridRef.current) return;
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' });
      gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card').forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<MagicBentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = false,
  cards = defaultCardData,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  useEffect(() => {
    if (shouldDisableAnimations || !rootRef.current || !gridRef.current) return;

    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card'));
    const media = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card__media'));
    const contents = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card__content'));
    const labels = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.magic-bento-card__label'));
    gsap.set(cards, { opacity: 0, y: 34, scale: 0.96, rotateX: 8, transformOrigin: '50% 100%' });
    gsap.set(media, { clipPath: 'inset(18% 10% 16% 10% round 12px)' });
    gsap.set(contents, { opacity: 0, y: 14 });
    gsap.set(labels, { opacity: 0, y: 8 });

    let introTimeline: gsap.core.Timeline | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        introTimeline
          .to(cards, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.86, stagger: 0.08 }, 0)
          .to(media, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.0, stagger: 0.08 }, 0.06)
          .to(labels, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06 }, 0.2)
          .to(contents, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.24);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(rootRef.current);

    return () => {
      observer.disconnect();
      introTimeline?.kill();
    };
  }, [shouldDisableAnimations]);

  return (
    <div ref={rootRef} className="magic-bento-root">
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="magic-bento-card-grid bento-section" ref={gridRef}>
        {cards.map((card, index) => {
          const className = `magic-bento-card ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${
            enableBorderGlow ? 'magic-bento-card--border-glow' : ''
          }`;

          const commonProps = {
            className,
            style: { backgroundColor: card.color, ['--glow-color' as string]: glowColor },
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...commonProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <span className="magic-bento-card__cursor-glow" aria-hidden="true"></span>
                <span className="magic-bento-card__sheen" aria-hidden="true"></span>
                <div className="magic-bento-card__media">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="magic-bento-card__image"
                  />
                </div>
                {card.label ? (
                  <div className="magic-bento-card__header">
                    <div className="magic-bento-card__label">{card.label}</div>
                  </div>
                ) : null}
                <div className="magic-bento-card__content">
                  <h3 className="magic-bento-card__title">{card.title}</h3>
                  <p className="magic-bento-card__description">{card.description}</p>
                </div>
              </ParticleCard>
            );
          }

          return (
            <div key={index} {...commonProps}>
              <span className="magic-bento-card__cursor-glow" aria-hidden="true"></span>
              <span className="magic-bento-card__sheen" aria-hidden="true"></span>
              <div className="magic-bento-card__media">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="magic-bento-card__image"
                />
              </div>
              {card.label ? (
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
              ) : null}
              <div className="magic-bento-card__content">
                <h3 className="magic-bento-card__title">{card.title}</h3>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;
