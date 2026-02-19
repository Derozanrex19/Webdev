import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import './CircularText.css';

type HoverMode = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers' | 'normal';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: HoverMode;
  className?: string;
  showArrow?: boolean;
  startAngle?: number;
  disableSpin?: boolean;
}

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  showArrow = false,
  startAngle = 18,
  disableSpin = false,
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotationRef = useRef(0);

  useEffect(() => {
    if (disableSpin) {
      controls.set({ rotate: 0, scale: 1 });
      return;
    }
    const start = rotationRef.current;
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, disableSpin]);

  const handleHoverStart = () => {
    if (disableSpin) return;
    const start = rotationRef.current;
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 },
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.84;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
        break;
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    if (disableSpin) return;
    const start = rotationRef.current;
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      initial={{ rotate: 0 }}
      animate={controls}
      onUpdate={(latest) => {
        if (typeof latest.rotate === 'number') {
          rotationRef.current = latest.rotate;
        }
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <span className="circular-text__center-dot" aria-hidden="true" />
      {showArrow ? <span className="circular-text__arrow" aria-hidden="true" /> : null}
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i + startAngle;
        const transform = `rotate(${rotationDeg}deg) translateY(-36px)`;
        return (
          <span key={`${letter}-${i}`} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
