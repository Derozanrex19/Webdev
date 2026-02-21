import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import './VariableProximity.css';

type FalloffType = 'linear' | 'exponential' | 'gaussian';

interface VariableProximityProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: FalloffType;
}

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: React.RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (event: MouseEvent) => updatePosition(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 120,
    falloff = 'linear',
    className = '',
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: Number.NaN, y: Number.NaN });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settings: string) =>
      new Map(
        settings
          .split(',')
          .map((setting) => setting.trim())
          .map((setting) => {
            const [name, value] = setting.split(' ');
            return [name.replace(/['"]/g, ''), Number.parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateFalloff = useCallback(
    (distance: number) => {
      const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return normalized ** 2;
        case 'gaussian':
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case 'linear':
        default:
          return normalized;
      }
    },
    [falloff, radius]
  );

  useAnimationFrame(
    useCallback(() => {
      if (!containerRef.current) return;

      const { x, y } = mousePositionRef.current;
      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
      lastPositionRef.current = { x, y };

      const containerRect = containerRef.current.getBoundingClientRect();

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

        const dx = x - letterCenterX;
        const dy = y - letterCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= radius) {
          letterRef.style.fontVariationSettings = fromFontVariationSettings;
          letterRef.style.transform = 'translate3d(0, 0, 0)';
          return;
        }

        const falloffValue = calculateFalloff(distance);
        const settings = parsedSettings
          .map(({ axis, fromValue, toValue }) => `'${axis}' ${fromValue + (toValue - fromValue) * falloffValue}`)
          .join(', ');

        interpolatedSettingsRef.current[index] = settings;
        letterRef.style.fontVariationSettings = settings;
        letterRef.style.transform = `translate3d(0, ${(-6 * falloffValue).toFixed(2)}px, 0)`;
      });
    }, [calculateFalloff, containerRef, fromFontVariationSettings, mousePositionRef, parsedSettings, radius])
  );

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="variable-proximity__word">
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={`${letter}-${currentLetterIndex}`}
                ref={(element) => {
                  letterRefs.current[currentLetterIndex] = element;
                }}
                className="variable-proximity__letter"
                style={{
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings,
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="variable-proximity__space">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
