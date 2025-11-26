
import React, { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AnimusChat } from './components/AnimusChat';
import { AnimusVoice } from './components/AnimusVoice';
import { Preloader } from './components/Preloader';
import { ACLogo } from './components/ACLogo';
import { ScrollToTop } from './components/ScrollToTop';
import { EagleVisionToggle } from './components/EagleVisionToggle';
import { EagleVisionProvider } from './contexts/EagleVisionContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any to avoid type errors in this environment
const MDiv = motion.div as any;

const AppContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <main className="min-h-screen bg-ac-dark eagle:bg-eagle-dark font-sans text-white selection:bg-ac-red selection:text-white transition-colors duration-700">
      
      <Preloader />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-gray-800 eagle:border-eagle-gold/30 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <ACLogo className="w-8 h-8 text-white fill-current group-hover:text-ac-red eagle:group-hover:text-eagle-gold transition-colors duration-300" />
            <span className="text-2xl font-serif font-bold tracking-widest text-white">
              EZIO<span className="text-ac-red eagle:text-eagle-gold group-hover:text-white transition-colors">.</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-white eagle:text-gray-300 eagle:hover:text-eagle-gold transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-ac-red eagle:after:bg-eagle-gold hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
            <a 
               href="https://cal.com/ezioedits"
               target="_blank"
               rel="noopener noreferrer"
               className="px-5 py-2 border border-ac-red text-ac-red eagle:border-eagle-gold eagle:text-eagle-gold hover:bg-ac-red eagle:hover:bg-eagle-gold hover:text-white eagle:hover:text-black transition-all font-bold text-xs uppercase tracking-widest shadow-[0_0_0_transparent] eagle:hover:shadow-[0_0_15px_rgba(251,191,36,0.6)]"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <MDiv 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black eagle:bg-eagle-dark flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map(link => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-serif font-bold hover:text-ac-red eagle:hover:text-eagle-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
          </MDiv>
        )}
      </AnimatePresence>

      <Hero />
      <Portfolio />
      <About />
      <Contact />
      
      <ScrollToTop />
      <EagleVisionToggle />
      <AnimusVoice />
      <AnimusChat />

    </main>
  );
};

const App: React.FC = () => {
  return (
    <EagleVisionProvider>
      <AppContent />
    </EagleVisionProvider>
  );
};

export default App;
