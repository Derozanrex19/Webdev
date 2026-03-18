import React, { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface IvaFloatButtonProps {
  onOpen: () => void;
}

const IvaFloatButton: React.FC<IvaFloatButtonProps> = ({ onOpen }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  useEffect(() => {
    const updateBounds = () => {
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const maxX = Math.max(8, window.innerWidth - rect.width - 8);
      const maxY = Math.max(8, window.innerHeight - rect.height - 8);

      setPosition((prev) => ({
        x: prev.x === 0 ? maxX : Math.min(prev.x, maxX),
        y: prev.y === 0 ? maxY : Math.min(prev.y, maxY),
      }));
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const updatePosition = (clientX: number, clientY: number) => {
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const nextX = clientX - dragOffsetRef.current.x;
      const nextY = clientY - dragOffsetRef.current.y;
      const maxX = Math.max(8, window.innerWidth - rect.width - 8);
      const maxY = Math.max(8, window.innerHeight - rect.height - 8);
      dragMovedRef.current = true;

      setPosition({
        x: Math.min(Math.max(8, nextX), maxX),
        y: Math.min(Math.max(8, nextY), maxY),
      });
    };

    const handleMouseMove = (event: MouseEvent) => updatePosition(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };
    const stopDragging = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [dragging]);

  const startDragging = (clientX: number, clientY: number) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    dragMovedRef.current = false;
    setDragging(true);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => {
        if (!dragMovedRef.current) onOpen();
      }}
      aria-label="Open Iva assistant"
      className={`iva-float-btn group fixed z-[70] inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-saffron/70 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={(event) => startDragging(event.clientX, event.clientY)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (!touch) return;
        startDragging(touch.clientX, touch.clientY);
      }}
    >
      <span className="iva-float-btn__icon inline-flex h-9 w-9 items-center justify-center rounded-full">
        <Bot className="h-5 w-5" />
      </span>
      <span className="hidden pr-1 sm:inline">Ask Iva</span>
      <span className="iva-float-btn__spark absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-lifewood-saffron text-lifewood-darkSerpent">
        <Sparkles className="h-2.5 w-2.5" />
      </span>
    </button>
  );
};

export default IvaFloatButton;
