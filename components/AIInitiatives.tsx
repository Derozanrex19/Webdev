import React from 'react';
import { 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  CheckCircle, 
  Globe, 
  Database, 
  Filter, 
  PenTool, 
  ArrowRight 
} from 'lucide-react';
import { Page } from '../types';

interface AIInitiativesProps {
  onNavigate: (page: Page) => void;
}

const AIInitiatives: React.FC<AIInitiativesProps> = ({ onNavigate }) => {
  return (
    <div className="bg-lifewood-seasalt min-h-screen">
      
      {/* SECTION A: THE HERO */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-lifewood-white">
        {/* Tech Pattern Background */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#133020 1px, transparent 1px), linear-gradient(90deg, #133020 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 animate-fade-in-up">
           <div className="inline-block mb-4">
              <span className="px-4 py-1 rounded-full bg-lifewood-castleton/10 text-lifewood-castleton font-bold text-xs uppercase tracking-widest border border-lifewood-castleton/20">
                Corporate AI Solutions
              </span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold text-lifewood-darkSerpent mb-6 tracking-tight">
             AI DATA SERVICES
           </h1>
           
           <h2 className="text-xl md:text-2xl text-lifewood-darkSerpent/80 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
             Lifewood delivers end-to-end AI data solutions—from multi-language data collection and annotation to model training and generative AI content.
           </h2>
           
           <p className="text-lifewood-darkSerpent/60 max-w-2xl mx-auto mb-10 text-base">
             Leveraging our global workforce, industrialized methodology, and proprietary LiFT platform, we enable organizations to scale efficiently.
           </p>
           
           <button 
             onClick={() => onNavigate(Page.CONTACT)}
             className="px-8 py-4 bg-lifewood-castleton text-white font-bold rounded-lg shadow-lg hover:bg-lifewood-darkSerpent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
           >
             Contact Us <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </section>

      {/* SECTION B: CORE SERVICES GRID */}
      <section className="py-20 px-4 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Text Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-lifewood-grey-light hover:shadow-2xl hover:border-lifewood-castleton/30 transition-all duration-300 group">
             <div className="w-12 h-12 bg-lifewood-seasalt rounded-lg flex items-center justify-center mb-6 group-hover:bg-lifewood-castleton transition-colors">
               <FileText className="w-6 h-6 text-lifewood-darkSerpent group-hover:text-white" />
             </div>
             <h3 className="text-lg font-bold text-lifewood-darkSerpent mb-3">Text</h3>
             <p className="text-sm text-lifewood-darkSerpent/70 leading-relaxed">
               Collection, labelling, transcription, sentiment analysis.
             </p>
          </div>

          {/* Video Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-lifewood-grey-light hover:shadow-2xl hover:border-lifewood-castleton/30 transition-all duration-300 group">
             <div className="w-12 h-12 bg-lifewood-seasalt rounded-lg flex items-center justify-center mb-6 group-hover:bg-lifewood-castleton transition-colors">
               <Video className="w-6 h-6 text-lifewood-darkSerpent group-hover:text-white" />
             </div>
             <h3 className="text-lg font-bold text-lifewood-darkSerpent mb-3">Video</h3>
             <p className="text-sm text-lifewood-darkSerpent/70 leading-relaxed">
               Collection, labelling, audit, subtitle generation.
             </p>
          </div>

          {/* Image Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-lifewood-grey-light hover:shadow-2xl hover:border-lifewood-castleton/30 transition-all duration-300 group">
             <div className="w-12 h-12 bg-lifewood-seasalt rounded-lg flex items-center justify-center mb-6 group-hover:bg-lifewood-castleton transition-colors">
               <ImageIcon className="w-6 h-6 text-lifewood-darkSerpent group-hover:text-white" />
             </div>
             <h3 className="text-lg font-bold text-lifewood-darkSerpent mb-3">Image</h3>
             <p className="text-sm text-lifewood-darkSerpent/70 leading-relaxed">
               Collection, labelling, classification, object detection.
             </p>
          </div>

          {/* Audio Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-lifewood-grey-light hover:shadow-2xl hover:border-lifewood-castleton/30 transition-all duration-300 group">
             <div className="w-12 h-12 bg-lifewood-seasalt rounded-lg flex items-center justify-center mb-6 group-hover:bg-lifewood-castleton transition-colors">
               <Mic className="w-6 h-6 text-lifewood-darkSerpent group-hover:text-white" />
             </div>
             <h3 className="text-lg font-bold text-lifewood-darkSerpent mb-3">Audio</h3>
             <p className="text-sm text-lifewood-darkSerpent/70 leading-relaxed">
               Collection, labelling, voice categorization, intelligent CS.
             </p>
          </div>

        </div>
      </section>

      {/* SECTION C: WHY BRANDS TRUST US */}
      <section className="py-20 bg-lifewood-white">
         <div className="max-w-5xl mx-auto px-4">
           
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-lifewood-darkSerpent mb-4">Why Brands Trust Us</h2>
             <div className="w-24 h-1 bg-lifewood-saffron mx-auto rounded-full"></div>
           </div>

           <div className="space-y-6">
             
             {/* Block 1 */}
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-lifewood-seasalt rounded-2xl border border-transparent hover:border-lifewood-castleton/20 transition-all animate-slide-in-right">
               <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-lifewood-castleton">
                    <CheckCircle className="w-7 h-7" />
                  </div>
               </div>
               <div>
                 <h4 className="text-xl font-bold text-lifewood-darkSerpent mb-2">Data Validation</h4>
                 <p className="text-lifewood-darkSerpent/70">
                   The goal is to create data that is consistent, accurate and complete. We verify that data conforms to predefined standards.
                 </p>
               </div>
             </div>

             {/* Block 2 */}
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-lifewood-seasalt rounded-2xl border border-transparent hover:border-lifewood-castleton/20 transition-all animate-slide-in-right" style={{ animationDelay: '100ms' }}>
               <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-lifewood-castleton">
                    <Globe className="w-7 h-7" />
                  </div>
               </div>
               <div>
                 <h4 className="text-xl font-bold text-lifewood-darkSerpent mb-2">Data Collection</h4>
                 <p className="text-lifewood-darkSerpent/70">
                   Multi-modal data collection across text, audio, image, and video. Scalable processes across 30+ languages.
                 </p>
               </div>
             </div>

             {/* Block 3 */}
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-lifewood-seasalt rounded-2xl border border-transparent hover:border-lifewood-castleton/20 transition-all animate-slide-in-right" style={{ animationDelay: '200ms' }}>
               <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-lifewood-castleton">
                    <Database className="w-7 h-7" />
                  </div>
               </div>
               <div>
                 <h4 className="text-xl font-bold text-lifewood-darkSerpent mb-2">Data Acquisition</h4>
                 <p className="text-lifewood-darkSerpent/70">
                   End-to-end solutions—capturing, processing, and managing large-scale, diverse datasets.
                 </p>
               </div>
             </div>

             {/* Block 4 */}
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-lifewood-seasalt rounded-2xl border border-transparent hover:border-lifewood-castleton/20 transition-all animate-slide-in-right" style={{ animationDelay: '300ms' }}>
               <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-lifewood-castleton">
                    <Filter className="w-7 h-7" />
                  </div>
               </div>
               <div>
                 <h4 className="text-xl font-bold text-lifewood-darkSerpent mb-2">Data Curation</h4>
                 <p className="text-lifewood-darkSerpent/70">
                   We sift, select and index data to ensure reliability and accessibility.
                 </p>
               </div>
             </div>

             {/* Block 5 */}
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-lifewood-seasalt rounded-2xl border border-transparent hover:border-lifewood-castleton/20 transition-all animate-slide-in-right" style={{ animationDelay: '400ms' }}>
               <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-lifewood-castleton">
                    <PenTool className="w-7 h-7" />
                  </div>
               </div>
               <div>
                 <h4 className="text-xl font-bold text-lifewood-darkSerpent mb-2">Data Annotation</h4>
                 <p className="text-lifewood-darkSerpent/70">
                   High quality annotation services for computer vision and natural language processing.
                 </p>
               </div>
             </div>

           </div>
         </div>
      </section>

      {/* Stock Image Filler Section for Aesthetics */}
      <section className="h-96 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2074&auto=format&fit=crop" 
          alt="Data Processing" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-lifewood-darkSerpent/80 flex items-center justify-center">
            <h3 className="text-4xl font-bold text-white text-center px-4">
                Powering the next generation of <br/> 
                <span className="text-lifewood-saffron">Generative AI</span>
            </h3>
        </div>
      </section>

    </div>
  );
};

export default AIInitiatives;