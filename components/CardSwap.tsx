import React, {
  Children,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
} from 'react';
import gsap from 'gsap';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card: React.FC<CardProps> = ({ customClass, children, className, ...rest }) => (
  <div
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white/10 bg-white [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${className ?? ''}`.trim()}
  >
    {children}
  </div>
);

export interface CardSwapHandle {
  swapTo: (targetIndex: number) => void;
}

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const snapToSlot = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

interface CardSwapProps {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  onFrontChange?: (newFrontIndex: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'smooth';
  children: React.ReactNode;
}

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
      width = 500,
      height = 400,
      cardDistance = 60,
      verticalDistance = 70,
      onFrontChange,
      skewAmount = 6,
      easing = 'elastic',
      children,
    },
    ref
  ) => {
    const config =
      easing === 'elastic'
        ? { ease: 'elastic.out(0.6,0.9)', durDrop: 1.6, durMove: 1.6, durReturn: 1.6, promoteOverlap: 0.9, returnDelay: 0.05 }
        : { ease: 'power1.inOut', durDrop: 0.6, durMove: 0.6, durReturn: 0.6, promoteOverlap: 0.45, returnDelay: 0.2 };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const cardEls = useRef<(HTMLDivElement | null)[]>([]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const setCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
      cardEls.current[i] = el;
    }, []);

    const finishCurrent = useCallback(() => {
      if (tlRef.current) {
        tlRef.current.progress(1, false);
        tlRef.current.kill();
        tlRef.current = null;
      }
    }, []);

    const applyOrder = useCallback((newOrder: number[]) => {
      const els = cardEls.current;
      const total = els.length;
      order.current = newOrder;
      newOrder.forEach((idx, pos) => {
        const el = els[idx];
        if (el) snapToSlot(el, makeSlot(pos, cardDistance, verticalDistance, total), skewAmount);
      });
    }, [cardDistance, verticalDistance, skewAmount]);

    const swapFrontToBack = useCallback(() => {
      if (order.current.length < 2) return;

      finishCurrent();

      const els = cardEls.current;
      const total = els.length;
      const [front, ...rest] = order.current;
      const elFront = els[front];
      if (!elFront) return;

      const newOrder = [...rest, front];
      order.current = newOrder;

      onFrontChange?.(rest[0]);

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = els[idx];
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
    }, [cardDistance, verticalDistance, config, skewAmount, onFrontChange, finishCurrent]);

    const swapTo = useCallback(
      (targetIndex: number) => {
        const currentFront = order.current[0];
        if (currentFront === targetIndex) return;
        if (order.current.indexOf(targetIndex) === -1) return;

        finishCurrent();

        const els = cardEls.current;
        const total = els.length;
        const newOrder = [targetIndex, ...order.current.filter((x) => x !== targetIndex)];
        order.current = newOrder;

        const tl = gsap.timeline();
        tlRef.current = tl;

        newOrder.forEach((idx, i) => {
          const el = els[idx];
          if (!el) return;
          const slot = makeSlot(i, cardDistance, verticalDistance, total);
          tl.to(
            el,
            { x: slot.x, y: slot.y, z: slot.z, zIndex: slot.zIndex, duration: config.durMove, ease: config.ease },
            0
          );
        });
      },
      [cardDistance, verticalDistance, config, finishCurrent]
    );

    useImperativeHandle(ref, () => ({ swapTo }), [swapTo]);

    useEffect(() => {
      const total = cardEls.current.length;
      if (total < 2) return;

      const initialOrder = Array.from({ length: total }, (_, i) => i);
      applyOrder(initialOrder);

      return () => { tlRef.current?.kill(); };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, skewAmount, easing]);

    return (
      <div
        ref={containerRef}
        className="absolute bottom-0 right-0 origin-bottom-right [perspective:900px] overflow-visible translate-x-[5%] translate-y-[20%] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
        style={{ width, height }}
      >
        {childArr.map((child, i) =>
          isValidElement(child) ? (
            <div
              key={i}
              ref={(el) => setCardRef(el, i)}
              style={{ width, height, cursor: 'pointer' }}
              className="absolute top-1/2 left-1/2 rounded-xl border border-white/10 bg-white [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] overflow-hidden shadow-2xl"
              onClick={() => {
                if (order.current[0] === i) {
                  swapFrontToBack();
                }
              }}
            >
              {(child as React.ReactElement).props.children}
            </div>
          ) : (
            child
          )
        )}
      </div>
    );
  }
);

CardSwap.displayName = 'CardSwap';

export default CardSwap;
