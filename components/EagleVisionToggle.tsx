
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useEagleVision } from '../contexts/EagleVisionContext';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any
const MButton = motion.button as any;
const MDiv = motion.div as any;

export const EagleVisionToggle: React.FC = () => {
  const { isEagleVision, toggleEagleVision } = useEagleVision();

  return (
    <div className="fixed top-24 right-6 z-40 font-sans">
      <MButton
        onClick={toggleEagleVision}
        className={`
            group relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500
            ${isEagleVision 
                ? 'bg-eagle-dark border-eagle-gold shadow-[0_0_20px_rgba(251,191,36,0.5)]' 
                : 'bg-black/50 border-gray-600 hover:border-white backdrop-blur-sm'
            }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isEagleVision ? (
            <MDiv
              key="active"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="relative"
            >
                <div className="absolute inset-0 bg-eagle-blue blur-md opacity-50 animate-pulse"></div>
                <Eye className="w-5 h-5 text-eagle-gold relative z-10" />
            </MDiv>
          ) : (
            <MDiv
              key="inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
               <EyeOff className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </MDiv>
          )}
        </AnimatePresence>
        
        {/* Tooltip */}
        <span className={`absolute right-full mr-4 px-2 py-1 text-xs uppercase tracking-widest rounded bg-black/80 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isEagleVision ? 'text-eagle-gold' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>
           {isEagleVision ? 'Eagle Sense Active' : 'Eagle Sense'}
        </span>
      </MButton>
    </div>
  );
};
