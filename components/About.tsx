
import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Activity, Film, Layers } from 'lucide-react';

const SKILLS = [
  { name: 'Adobe Premiere', level: 95 },
  { name: 'After Effects', level: 85 },
  { name: 'DaVinci Resolve', level: 80 },
  { name: 'Cinema 4D', level: 60 },
];

declare global {
  interface Window {
    Vimeo: any;
  }
}

export const About: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initPlayer = () => {
      if (window.Vimeo && iframeRef.current && !playerRef.current) {
        // Initialize Vimeo Player
        playerRef.current = new window.Vimeo.Player(iframeRef.current);
        
        playerRef.current.ready().then(() => {
          console.log("Audio Player Ready");
          // Ensure it's paused and reset initially
          playerRef.current.pause().catch(() => {});
          playerRef.current.setLoop(true).catch(() => {});
        }).catch((err: any) => console.error("Player ready failed", err));
      }
    };

    if (window.Vimeo) {
      initPlayer();
    } else {
      const script = document.querySelector('script[src*="player.vimeo.com"]');
      if (script) {
        script.addEventListener('load', initPlayer);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.unload();
      }
    };
  }, []);

  const toggleSound = async () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        await playerRef.current.pause();
        setIsPlaying(false);
      } else {
        // CRITICAL: We must set volume and unmute during the click interaction
        // to bypass browser autoplay policies for hidden iframes.
        await playerRef.current.setMuted(false);
        await playerRef.current.setVolume(0.5); 
        await playerRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      // Fallback: attempt to play anyway
      playerRef.current.play().catch((e: any) => console.error("Force play failed", e));
    }
  };

  return (
    <section id="about" className="py-24 bg-[#080808] text-white relative scroll-mt-24">
      {/* 
         Vimeo Audio Source
         - Removed 'autoplay=1' to prevent browser policy conflicts.
         - 'loop=1' keeps the ambience going.
         - 'autopause=0' ensures it plays even if not in focus.
      */}
      <iframe
        ref={iframeRef}
        src="https://player.vimeo.com/video/1139587106?badge=0&autopause=0&player_id=0&app_id=58479&loop=1"
        style={{ 
          position: 'absolute', 
          width: '10px', 
          height: '10px', 
          opacity: 0.01, 
          pointerEvents: 'none',
          zIndex: -1 
        }}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        title="Ambience Sound"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">BEHIND THE <span className="text-ac-red">SCENES</span></h2>
            <div className="w-20 h-1 bg-ac-red mb-8"></div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              I am a visual storyteller obsessed with rhythm and flow. My work draws inspiration from historical aesthetics blended with futuristic glitches, mirroring the Animus concept.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              With over 5 years of experience in the industry, I help brands and creators unlock their visual potential through precise editing and immersive sound design.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
             <div className="p-6 border border-gray-800 hover:border-ac-red transition-colors group">
                <Film className="w-8 h-8 text-gray-600 group-hover:text-ac-red mb-4" />
                <h3 className="font-bold text-xl mb-1">Editing</h3>
                <p className="text-gray-500 text-sm">Precise cuts, perfect timing.</p>
             </div>
             <div className="p-6 border border-gray-800 hover:border-ac-red transition-colors group">
                <Activity className="w-8 h-8 text-gray-600 group-hover:text-ac-red mb-4" />
                <h3 className="font-bold text-xl mb-1">Color</h3>
                <p className="text-gray-500 text-sm">Mood defining grades.</p>
             </div>
             <div className="p-6 border border-gray-800 hover:border-ac-red transition-colors group">
                <Layers className="w-8 h-8 text-gray-600 group-hover:text-ac-red mb-4" />
                <h3 className="font-bold text-xl mb-1">VFX</h3>
                <p className="text-gray-500 text-sm">Seamless compositing.</p>
             </div>
             <div
                className={`p-6 border transition-all duration-300 group cursor-pointer ${
                  isPlaying 
                    ? 'border-ac-red bg-ac-red/10 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'border-gray-800 hover:border-ac-red'
                }`}
                onClick={toggleSound}
             >
                <Cpu className={`w-8 h-8 mb-4 transition-colors ${isPlaying ? 'text-ac-red animate-pulse' : 'text-gray-600 group-hover:text-ac-red'}`} />
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl mb-1">Sound</h3>
                  {isPlaying && <span className="text-xs text-ac-red font-mono animate-pulse">ACTIVE</span>}
                </div>
                <p className="text-gray-500 text-sm">Immersive audio design.</p>
             </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-ac-red/20 to-transparent opacity-50 blur-3xl"></div>
          <div className="relative border border-gray-800 bg-ac-gray p-8 md:p-12">
             <h3 className="text-2xl font-serif font-bold mb-8">SYNCHRONIZATION STATUS</h3>
             <div className="space-y-8">
               {SKILLS.map((skill) => (
                 <div key={skill.name}>
                   <div className="flex justify-between mb-2">
                     <span className="font-mono text-sm uppercase tracking-wider">{skill.name}</span>
                     <span className="font-mono text-sm text-ac-red">{skill.level}%</span>
                   </div>
                   <div className="h-1 w-full bg-gray-800">
                     <div 
                        className="h-full bg-ac-red shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                        style={{ width: `${skill.level}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
