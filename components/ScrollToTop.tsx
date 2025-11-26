import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any to avoid type errors in this environment
const MButton = motion.button as any;

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <MButton
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-24 z-40 w-14 h-14 flex items-center justify-center bg-ac-dark border border-ac-red text-ac-red rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-ac-red hover:text-white transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          {/* Decorative pulse ring on hover */}
          <div className="absolute inset-0 rounded-full border border-ac-red opacity-0 group-hover:animate-ping group-hover:opacity-30"></div>
          <ArrowUp className="w-6 h-6" />
        </MButton>
      )}
    </AnimatePresence>
  );
};