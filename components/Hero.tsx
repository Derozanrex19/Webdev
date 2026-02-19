import React from 'react';
import { ArrowRight, Globe, Zap, CheckCircle2, PlayCircle } from 'lucide-react';
import { Page } from '../types';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden bg-lifewood-darkSerpent text-lifewood-paper flex items-center">
      
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Global Data Network" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105 animate-pulse-slow"
        />
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent via-lifewood-darkSerpent/90 to-lifewood-darkSerpent/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lifewood-white/5 border border-lifewood-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lifewood-saffron opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lifewood-saffron"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-lifewood-saffron">AI Data Ecosystem</span>
          </div>
          
          <h1 className="font-sans text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
            Always On. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lifewood-saffron to-lifewood-earth">Never Off.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-lifewood-grey-light/80 font-light leading-relaxed max-w-xl border-l-2 border-lifewood-saffron/50 pl-6">
            The super-bridge connecting East and West. We fuel global AI models with ethically sourced, high-precision data from the heart of ASEAN.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onNavigate(Page.SERVICES)}
              className="px-8 py-4 bg-lifewood-saffron text-lifewood-darkSerpent font-bold rounded-full hover:bg-lifewood-earth transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-lifewood-saffron/20 hover:scale-105"
            >
              Explore Solutions <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate(Page.IVA)}
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 group"
            >
              <PlayCircle className="w-5 h-5 text-lifewood-saffron group-hover:scale-110 transition-transform" /> 
              Meet Iva AI
            </button>
          </div>

          <div className="pt-8 flex items-center gap-8 opacity-60">
             <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-lifewood-castleton" />
                <span className="text-sm font-medium">GDPR Compliant</span>
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-lifewood-castleton" />
                <span className="text-sm font-medium">99.9% Accuracy</span>
             </div>
          </div>
        </div>

        {/* Visual Element - Glassmorphism Card */}
        <div className="relative animate-fade-in-up-delay-1 hidden lg:block">
          {/* Floating abstract decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-lifewood-castleton/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-lifewood-saffron/20 rounded-full blur-2xl animate-pulse delay-700"></div>

          <div className="relative glass-panel rounded-2xl p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-sans tracking-widest text-lifewood-saffron animate-pulse">LIVE DATA STREAM</div>
            </div>

            {/* Content Mockup */}
            <div className="space-y-6 font-sans text-sm tracking-wide">
                <div className="flex justify-between items-center p-3 bg-lifewood-darkSerpent/50 rounded-lg border-l-4 border-lifewood-saffron animate-slide-in-right">
                    <div className="text-lifewood-grey-medium">Processing Nodes</div>
                    <div className="text-white font-bold">4,291 Active</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-lifewood-darkSerpent/50 rounded-lg border-l-4 border-lifewood-castleton animate-slide-in-right delay-100">
                    <div className="text-lifewood-grey-medium">Language Pairs</div>
                    <div className="text-white font-bold">CN ↔ EN ↔ MY</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-lifewood-darkSerpent/50 rounded-lg border-l-4 border-lifewood-earth animate-slide-in-right delay-200">
                    <div className="text-lifewood-grey-medium">Model Confidence</div>
                    <div className="text-white font-bold">98.4%</div>
                </div>
            </div>

            {/* Bottom Graph Representation */}
            <div className="mt-8 h-32 flex items-end justify-between gap-1 opacity-80">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                    <div 
                        key={i} 
                        style={{ height: `${height}%`, animationDelay: `${i * 100}ms` }}
                        className="w-full bg-gradient-to-t from-lifewood-castleton to-lifewood-saffron rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                    ></div>
                ))}
            </div>
          </div>
        </div>

      </div>
      
      {/* Ticker / Brands Strip */}
      <div className="absolute bottom-0 w-full bg-lifewood-white/5 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-lifewood-grey-light/50 text-xs font-bold uppercase tracking-widest">
           <span>Trusted by Global Innovators</span>
           <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60">
             {['Microsoft', 'Amazon', 'ByteDance', 'Nvidia', 'Tencent', 'Alibaba'].map(brand => (
                 <span key={brand} className="hover:text-lifewood-saffron transition-colors cursor-default">{brand}</span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;