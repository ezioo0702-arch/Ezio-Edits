
import React from 'react';
import { Mail, Instagram, Twitter, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-ac-dark relative overflow-hidden scroll-mt-24">
      {/* Decorative red line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ac-red/50 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-ac-red uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
          Initiate Uplink
        </span>
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8">
          LETS CREATE <br/> TOGETHER
        </h2>
        <p className="text-gray-400 mb-12 max-w-lg mx-auto text-lg">
          Available for freelance projects. Drop a message for inquiries, collaborations, or just to say hello.
        </p>

        <a 
          href="https://cal.com/ezioedits"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 bg-white text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-ac-red hover:text-white transition-colors duration-300 group"
        >
          <span>Start a Project</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        <div className="mt-24 flex justify-center gap-8">
           <a href="#" className="text-gray-500 hover:text-ac-red transition-colors">
             <Instagram className="w-6 h-6" />
           </a>
           <a href="#" className="text-gray-500 hover:text-ac-red transition-colors">
             <Twitter className="w-6 h-6" />
           </a>
           <a href="#" className="text-gray-500 hover:text-ac-red transition-colors">
             <Mail className="w-6 h-6" />
           </a>
        </div>
        
        <footer className="mt-24 pt-8 border-t border-gray-900 text-gray-600 text-sm font-mono">
           © {new Date().getFullYear()} EZIO PORTFOLIO. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </section>
  );
};
