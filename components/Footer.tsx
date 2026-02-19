import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-lifewood-darkSerpent text-lifewood-paper pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1 space-y-6">
             <div className="flex items-center gap-2">
                <div className="w-5 h-8 bg-lifewood-saffron" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                <span className="font-bold text-2xl tracking-tight text-white">lifewood</span>
             </div>
            <p className="text-sm leading-relaxed text-lifewood-paper/70">
              Lifewood is a global champion in AI data solutions, bridging innovation between East and West. Always On, Never Off.
            </p>
            <div className="flex space-x-4">
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-lifewood-saffron transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-lifewood-saffron transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-lifewood-saffron transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-lifewood-saffron uppercase tracking-widest text-xs font-bold mb-6">Solutions</h4>
            <ul className="space-y-3 text-sm text-lifewood-paper/80">
              <li className="hover:text-white cursor-pointer transition-colors">Data Processing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Generative AI</li>
              <li className="hover:text-white cursor-pointer transition-colors">IVA Development</li>
              <li className="hover:text-white cursor-pointer transition-colors">Data Library</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lifewood-saffron uppercase tracking-widest text-xs font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-lifewood-paper/80">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">ESG Impact</li>
              <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lifewood-saffron uppercase tracking-widest text-xs font-bold mb-6">Contact</h4>
            <div className="space-y-4 text-sm text-lifewood-paper/80">
               <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-lifewood-saffron flex-shrink-0 mt-0.5" />
                  <p>HQ: Menara Lifewood, Kuala Lumpur,<br/>Malaysia</p>
               </div>
               <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-lifewood-saffron flex-shrink-0" />
                  <p>hello@lifewood.com</p>
               </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-lifewood-paper/50">
            © {new Date().getFullYear()} Lifewood Data Solutions. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-lifewood-paper/50">
             <span className="hover:text-white cursor-pointer">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;