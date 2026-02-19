import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-lifewood-paper py-24 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 C 30 10 50 30 50 50 C 50 70 70 90 100 100 V 0 Z" fill="#046241" />
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-3 bg-lifewood-saffron/20 rounded-full mb-6">
                <MessageSquare className="w-6 h-6 text-lifewood-darkSerpent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-lifewood-darkSerpent mb-4">Start the Conversation</h2>
            <p className="text-lg text-lifewood-darkSerpent/70 max-w-2xl mx-auto">
                Ready to accelerate your AI roadmap? Whether you need data processing or strategic consulting, our team is Always On.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-lifewood-darkSerpent/5 animate-fade-in-up-delay-1">
            
            {/* Form */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-lifewood-darkSerpent">Send us a message</h3>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-lifewood-darkSerpent/60 uppercase tracking-widest">First Name</label>
                            <input type="text" className="w-full bg-lifewood-seasalt border border-transparent focus:border-lifewood-saffron rounded-lg p-4 focus:ring-2 focus:ring-lifewood-saffron/20 focus:outline-none transition-all" placeholder="Jane" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-lifewood-darkSerpent/60 uppercase tracking-widest">Last Name</label>
                            <input type="text" className="w-full bg-lifewood-seasalt border border-transparent focus:border-lifewood-saffron rounded-lg p-4 focus:ring-2 focus:ring-lifewood-saffron/20 focus:outline-none transition-all" placeholder="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-lifewood-darkSerpent/60 uppercase tracking-widest">Work Email</label>
                        <input type="email" className="w-full bg-lifewood-seasalt border border-transparent focus:border-lifewood-saffron rounded-lg p-4 focus:ring-2 focus:ring-lifewood-saffron/20 focus:outline-none transition-all" placeholder="jane@company.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-lifewood-darkSerpent/60 uppercase tracking-widest">How can we help?</label>
                        <textarea rows={4} className="w-full bg-lifewood-seasalt border border-transparent focus:border-lifewood-saffron rounded-lg p-4 focus:ring-2 focus:ring-lifewood-saffron/20 focus:outline-none transition-all" placeholder="Tell us about your project needs..."></textarea>
                    </div>
                    <button className="w-full bg-lifewood-darkSerpent text-white font-bold py-4 rounded-lg hover:bg-lifewood-castleton transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-xl">
                        Send Message <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Info Card */}
            <div className="flex flex-col justify-between bg-lifewood-darkSerpent text-lifewood-paper rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                {/* Hover Effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-lifewood-saffron/10 rounded-full blur-3xl group-hover:bg-lifewood-saffron/20 transition-colors duration-500"></div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                    <div className="space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="text-lifewood-saffron w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-lifewood-saffron uppercase tracking-widest mb-1">Email Us</p>
                                <p className="text-lg">business@lifewood.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="text-lifewood-saffron w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-lifewood-saffron uppercase tracking-widest mb-1">Call Us</p>
                                <p className="text-lg">+60 3-7932 1234</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="text-lifewood-saffron w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-lifewood-saffron uppercase tracking-widest mb-1">Global HQ</p>
                                <p className="text-lg">Menara Suezcap 1, KL Gateway,<br/>Kuala Lumpur, Malaysia</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
                     <p className="italic text-lg font-sans opacity-80">"Always On. Never Off."</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;