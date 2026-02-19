import React, { useState, useEffect } from 'react';
import { Plus, X, Cpu, BrainCircuit, ShieldCheck, ArrowRight, Headset, Mic, ScanEye, ScrollText } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const projects: ProjectItem[] = [
  {
    id: '2.1',
    title: 'Model Training',
    description: 'Large-scale data processing to optimize neural network weights and performance. We manage the entire pipeline from raw data ingestion to hyperparameter tuning, ensuring your models achieve state-of-the-art accuracy. Our distributed computing clusters allow for rapid iteration cycles.',
    icon: <BrainCircuit className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.2',
    title: 'Machine Learning Enablement',
    description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model. We provide the infrastructure and annotated datasets required to jumpstart your AI initiatives, reducing time-to-market by up to 40%.',
    icon: <Cpu className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.3',
    title: 'Data Validation',
    description: 'Ensuring accuracy and consistency across all datasets through automated and manual auditing. Our "human-in-the-loop" validation process guarantees 99.9% quality assurance for mission-critical applications, utilizing a global workforce of subject matter experts.',
    icon: <ShieldCheck className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.4',
    title: 'AI-Enabled Customer Service',
    description: 'AI-enabled customer service is now the quickest and most effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. AI powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts AI customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement.',
    icon: <Headset className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.5',
    title: 'Natural Language Processing and Speech Acquisition',
    description: "We have partnered with some of the world's most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.",
    icon: <Mic className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.6',
    title: 'Computer Vision',
    description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
    icon: <ScanEye className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2.7',
    title: 'Genealogy',
    description: "Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.\n\nWe have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.\n\nWorking across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by AI and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.\n\nGenealogical material that we have experience with includes: Census, Vital - BMD, Church and Parish Registers, Passenger Lists, Naturalisation, Military Records, Legal Records, Yearbooks.",
    icon: <ScrollText className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop'
  }
];

const Projects: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animations on mount
    setIsVisible(true);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-lifewood-paper min-h-screen font-sans text-lifewood-darkSerpent">
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden">
         {/* Background Image with Parallax-like effect */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
               alt="Digital Projects" 
               className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-lifewood-darkSerpent via-lifewood-darkSerpent/90 to-lifewood-darkSerpent/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-black/30"></div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <span className="inline-block py-1.5 px-4 rounded-full bg-lifewood-saffron/20 text-lifewood-saffron border border-lifewood-saffron/30 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    Our Portfolio
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Engineering <br/>
                    <span className="text-lifewood-saffron">Intelligence.</span>
                </h1>
                <p className="text-xl text-lifewood-grey-light/90 max-w-xl font-light leading-relaxed border-l-4 border-lifewood-castleton pl-6">
                    From neural network optimization to enterprise-grade validation, explore the technical initiatives powering our global AI infrastructure.
                </p>
            </div>
         </div>
      </section>

      {/* ACCORDION SECTION */}
      <section className="py-24 relative">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 w-1/3 h-full bg-lifewood-seasalt -z-10 skew-x-12 transform translate-x-20"></div>
         <div className="absolute bottom-20 left-10 w-64 h-64 bg-lifewood-saffron/5 rounded-full blur-3xl -z-10"></div>

         <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-lifewood-darkSerpent/5">
                {projects.map((item, index) => {
                  const isOpen = openId === item.id;
                  const delay = 300 + (index * 150);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`border-b border-gray-100 last:border-0 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                      style={{ transitionDelay: `${delay}ms` }}
                    >
                      {/* Accordion Header */}
                      <button 
                        onClick={() => toggleAccordion(item.id)}
                        className={`w-full flex items-center justify-between py-10 px-8 md:px-12 group transition-all duration-300 ${isOpen ? 'bg-lifewood-seasalt/50' : 'hover:bg-lifewood-seasalt/30'}`}
                      >
                        <div className="flex items-center gap-6 md:gap-8 text-left">
                          {/* Number */}
                           <div className="hidden md:block">
                              <span className={`text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${isOpen ? 'text-lifewood-castleton' : 'text-gray-300'}`}>
                                 Project {item.id}
                              </span>
                           </div>

                          {/* Icon & Title */}
                          <div className="flex items-center gap-6">
                             <div className={`p-3 rounded-xl transition-all duration-300 ${isOpen ? 'bg-lifewood-castleton shadow-lg scale-110' : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'}`}>
                                {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { 
                                    className: `w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-lifewood-darkSerpent'}` 
                                })}
                             </div>
                             <div>
                                <h3 className={`text-xl md:text-2xl font-bold font-sans transition-colors duration-300 ${isOpen ? 'text-lifewood-castleton' : 'text-lifewood-darkSerpent'}`}>
                                  {item.title}
                                </h3>
                                <div className="md:hidden mt-1">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase ${isOpen ? 'text-lifewood-castleton/70' : 'text-gray-300'}`}>
                                        Project {item.id}
                                    </span>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? 'border-lifewood-castleton bg-lifewood-castleton' : 'border-gray-200 group-hover:border-lifewood-castleton'}`}>
                           <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                              <Plus className="w-5 h-5 text-gray-400 group-hover:text-lifewood-castleton" />
                           </div>
                           <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                              <X className="w-5 h-5 text-white" />
                           </div>
                        </div>
                      </button>

                      {/* Accordion Body */}
                      <div 
                        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden bg-lifewood-seasalt/30">
                          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-start">
                            
                            {/* Image Section */}
                            <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg transition-all duration-700 delay-100 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" 
                                />
                                <div className="absolute inset-0 bg-lifewood-darkSerpent/10 group-hover:bg-transparent transition-colors"></div>
                            </div>

                            {/* Content Section */}
                            <div className={`flex flex-col justify-center transition-all duration-700 delay-200 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                                <div className="h-1 w-12 bg-lifewood-saffron mb-6 rounded-full"></div>
                                <div className="text-lifewood-darkSerpent/70 text-lg leading-relaxed whitespace-pre-line">
                                  {item.description}
                                </div>
                                <button className="mt-8 flex items-center gap-2 text-sm font-bold text-lifewood-castleton uppercase tracking-wider group/link hover:text-lifewood-saffron transition-colors w-fit">
                                    View Case Study <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-lifewood-darkSerpent py-24 border-t border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }}>
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your project?</h2>
              <p className="text-lifewood-paper/60 mb-10 max-w-2xl mx-auto text-lg">
                  Our team of engineers and data specialists are ready to integrate with your workflow. Experience the precision of Lifewood's data engine.
              </p>
              <button className="bg-lifewood-saffron text-lifewood-darkSerpent font-bold py-4 px-10 rounded-full hover:bg-white transition-colors duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform flex items-center gap-2 mx-auto">
                  Get in Touch
              </button>
          </div>
      </section>
    </div>
  );
};

export default Projects;