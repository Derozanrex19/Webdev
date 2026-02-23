import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SplitMode = 'chars' | 'words';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitMode | string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties['textAlign'];
  tag?: keyof React.JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

const parseStart = (threshold: number, rootMargin: string) => {
  const startPct = (1 - threshold) * 100;
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
  const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch?.[2] || 'px';
  if (!marginValue) return `top ${startPct}%`;
  const op = marginValue < 0 ? '-=' : '+=';
  return `top ${startPct}%${op}${Math.abs(marginValue)}${marginUnit}`;
};

const splitChars = (value: string) =>
  value.split(/(\s+)/).map((part, partIndex) => {
    if (/^\s+$/.test(part)) {
      return (
        <span key={`csp-${partIndex}`} aria-hidden="true" style={{ whiteSpace: 'pre-wrap' }}>
          {part}
        </span>
      );
    }

    return (
      <span
        key={`cw-${partIndex}`}
        aria-hidden="true"
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {Array.from(part).map((char, charIndex) => (
          <span
            key={`c-${partIndex}-${charIndex}`}
            data-split-item="char"
            style={{ display: 'inline-block' }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </span>
    );
  });

const splitWords = (value: string) =>
  value.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part)) {
      return (
        <span key={`wsp-${index}`} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
          {part}
        </span>
      );
    }
    return (
      <span key={`w-${index}`} data-split-item="word" style={{ display: 'inline-block' }} aria-hidden="true">
        {part}
      </span>
    );
  });

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
  showCallback = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const completedRef = useRef(false);
  const callbackRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fontSet) {
      setFontsLoaded(true);
      return;
    }
    if (fontSet.status === 'loaded') {
      setFontsLoaded(true);
      return;
    }
    fontSet.ready.then(() => setFontsLoaded(true)).catch(() => setFontsLoaded(true));
  }, []);

  const renderedChildren = useMemo(() => {
    if (splitType.includes('word')) return splitWords(text);
    return splitChars(text);
  }, [splitType, text]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fontsLoaded || !text || completedRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-split-item]'));
      if (!targets.length) return;

      if (prefersReducedMotion) {
        gsap.set(targets, to);
        completedRef.current = true;
        if (showCallback) callbackRef.current?.();
        return;
      }

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: parseStart(threshold, rootMargin),
            once: true,
            fastScrollEnd: true,
          },
          onComplete: () => {
            completedRef.current = true;
            if (showCallback) callbackRef.current?.();
            else callbackRef.current?.();
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        threshold,
        rootMargin,
        fontsLoaded,
        JSON.stringify(from),
        JSON.stringify(to),
        showCallback,
      ],
      scope: ref,
    }
  );

  const Tag = tag as keyof React.JSX.IntrinsicElements;

  return (
    <Tag
      ref={ref as React.Ref<any>}
      className={className}
      style={{
        textAlign,
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
      aria-label={text}
    >
      {renderedChildren}
    </Tag>
  );
};

export default SplitText;
