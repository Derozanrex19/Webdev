import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface IvaFloatButtonProps {
  onNavigate: (page: Page) => void;
}

const IvaFloatButton: React.FC<IvaFloatButtonProps> = ({ onNavigate }) => {
  return (
    <button
      type="button"
      onClick={() => onNavigate(Page.IVA)}
      aria-label="Open Iva assistant"
      className="iva-float-btn group fixed bottom-6 right-4 z-[70] inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-saffron/70 sm:bottom-7 sm:right-7"
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
