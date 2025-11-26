
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { EncryptedText } from './EncryptedText';

// Cast motion components to any to avoid type errors in this environment
const MDiv = motion.div as any;
const MP = motion.p as any;

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 20,
          ease: "linear" as const,
        },
      },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-ac-dark eagle:bg-eagle-dark border-b border-gray-900 eagle:border-eagle-gold/20 transition-colors duration-700">
      
      {/* 
         ID added here for GSAP targeting from Preloader.tsx 
         This allows the "zoom out" effect when the loader finishes.
      */}
      <div id="hero-content" className="absolute inset-0 w-full h-full">
        
        {/* Video Background Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          {/* Adjusted scale to 150% to zoom out slightly while maintaining coverage */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none select-none">
              <iframe 
                  className="w-full h-full object-cover opacity-40 grayscale contrast-125"
                  src="https://player.vimeo.com/video/1139331636?background=1&autoplay=1&loop=1&badge=0&autopause=0&player_id=0&app_id=58479"
                  title="Animus Background Memory"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ pointerEvents: 'none' }}
              />
          </div>
          {/* Cinematic Overlays to blend video into the AC Theme */}
          {/* Default: Red/Dark. Eagle Vision: Blue/Slate. */}
          <div className="absolute inset-0 bg-ac-dark/50 mix-blend-multiply eagle:bg-eagle-dark/60 eagle:mix-blend-overlay transition-colors duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-ac-dark via-transparent to-ac-dark eagle:from-eagle-dark eagle:to-eagle-dark transition-colors duration-700"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] eagle:bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)] opacity-80 transition-all duration-700"></div>
        </div>

        {/* Abstract Tech Lines */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-px h-[40vh] bg-gradient-to-b from-transparent via-ac-red/50 to-transparent eagle:via-eagle-gold/50 transition-colors duration-700"></div>
          <div className="absolute bottom-[10%] right-[5%] w-px h-[40vh] bg-gradient-to-b from-transparent via-ac-red/50 to-transparent eagle:via-eagle-gold/50 transition-colors duration-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full border border-gray-900 eagle:border-eagle-gold/30 opacity-20 eagle:opacity-40 transition-all duration-700"></div>
          
          {/* Eagle Vision Only: Pulse Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full border border-eagle-blue/20 opacity-0 eagle:opacity-100 eagle:animate-pulse transition-opacity duration-1000"></div>
        </div>

        {/* Main Content */}
        <div className="z-10 text-center space-y-8 px-4 relative h-full flex flex-col justify-center items-center">
          <MDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 bg-black/50 px-4 py-1 backdrop-blur-sm border border-ac-red/30 eagle:border-eagle-gold/50 inline-block transition-colors duration-700">
              <EncryptedText 
                text="Synchronizing Portfolio"
                className="text-ac-red eagle:text-eagle-gold tracking-[0.5em] text-sm md:text-base font-medium font-sans uppercase transition-colors duration-700"
                encryptedClassName="text-ac-red/60 eagle:text-eagle-gold/60"
                revealedClassName="text-ac-red eagle:text-eagle-gold"
                revealDelayMs={80}
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
              VISUAL <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 eagle:from-eagle-gold eagle:via-yellow-200 eagle:to-eagle-gold transition-all duration-700">
                ARCHITECT
              </span>
            </h1>
          </MDiv>

          {/* Hidden Lore - Visible Only in Eagle Vision */}
          <div className="absolute top-1/3 right-[10%] opacity-0 eagle:opacity-100 transition-opacity duration-1000 pointer-events-none">
            <p className="text-eagle-gold font-mono text-xs tracking-widest writing-vertical-rl animate-pulse">
              TARGET IDENTIFIED: MASTER EDITOR
            </p>
          </div>

          <MP 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-lg mx-auto text-gray-300 eagle:text-blue-100 text-sm md:text-base font-sans leading-relaxed drop-shadow-md bg-black/30 eagle:bg-eagle-dark/50 p-4 backdrop-blur-sm border-l-2 border-ac-red/50 eagle:border-eagle-gold/50 transition-all duration-700"
          >
            Editing reality frame by frame. Specialized in high-impact visuals for gaming, cinema, and brand storytelling.
          </MP>

          <MDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="pt-8"
          >
              <a href="#work" className="group relative px-8 py-3 overflow-hidden bg-transparent border border-white/20 hover:border-ac-red eagle:hover:border-eagle-gold transition-colors duration-300 inline-block">
                <div className="absolute inset-0 w-0 bg-ac-red eagle:bg-eagle-gold transition-all duration-[250ms] ease-out group-hover:w-full opacity-10 eagle:opacity-20"></div>
                <span className="relative text-white font-sans tracking-[0.2em] text-sm uppercase group-hover:text-white eagle:group-hover:text-eagle-gold transition-colors">See My Works</span>
              </a>
          </MDiv>
        </div>
      </div>

      {/* Scrolling Marquee at bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden whitespace-nowrap opacity-30 pointer-events-none z-10 bg-gradient-to-t from-black to-transparent pt-20 pb-8">
         <MDiv 
            className="inline-flex gap-8 text-8xl font-bold text-stroke font-sans text-transparent transition-colors duration-700"
            style={{ WebkitTextStroke: '1px var(--stroke-color, #dc2626)' }}
            variants={marqueeVariants}
            animate="animate"
         >
           <span className="eagle:hidden">
              EDITING • COLOR GRADING • VFX • MOTION DESIGN • SOUND DESIGN • EDITING • COLOR GRADING • VFX •
           </span>
           <span className="hidden eagle:inline text-eagle-gold/20" style={{ WebkitTextStroke: '1px #fbbf24' }}>
              TRUTH • KNOWLEDGE • FREEDOM • CHAOS • ORDER • TRUTH • KNOWLEDGE • FREEDOM • CHAOS • ORDER •
           </span>
         </MDiv>
      </div>

      <MDiv 
        style={{ y: y1 }}
        className="absolute bottom-8 z-20 text-white animate-bounce cursor-pointer"
      >
        <ArrowDown className="w-6 h-6 text-ac-red eagle:text-eagle-gold transition-colors duration-700" />
      </MDiv>
    </section>
  );
};
