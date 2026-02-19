import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startCounting?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startCounting = true,
  separator = '',
  onStart,
  onEnd,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = useCallback((num: number) => {
    const str = num.toString();
    if (!str.includes('.')) return 0;
    const decimals = str.split('.')[1];
    if (!decimals || parseInt(decimals, 10) === 0) return 0;
    return decimals.length;
  }, []);

  const maxDecimals = useMemo(
    () => Math.max(getDecimalPlaces(from), getDecimalPlaces(to)),
    [from, to, getDecimalPlaces]
  );

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = formatValue(direction === 'down' ? to : from);
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (!(isInView && startCounting)) return;

    if (typeof onStart === 'function') onStart();

    const timeoutId = window.setTimeout(() => {
      motionValue.set(direction === 'down' ? from : to);
    }, delay * 1000);

    const durationTimeoutId = window.setTimeout(() => {
      if (typeof onEnd === 'function') onEnd();
    }, delay * 1000 + duration * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(durationTimeoutId);
    };
  }, [isInView, startCounting, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (!ref.current) return;
      ref.current.textContent = formatValue(latest);
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
};

export default CountUp;
