
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface EagleVisionContextType {
  isEagleVision: boolean;
  toggleEagleVision: () => void;
}

const EagleVisionContext = createContext<EagleVisionContextType | undefined>(undefined);

declare global {
  interface Window {
    Vimeo: any;
  }
}

export const EagleVisionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEagleVision, setIsEagleVision] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  // Initialize Vimeo Player for SFX
  useEffect(() => {
    const initPlayer = () => {
        if (window.Vimeo && iframeRef.current && !playerRef.current) {
            playerRef.current = new window.Vimeo.Player(iframeRef.current);
            playerRef.current.setVolume(0.5).catch(() => {}); 
            playerRef.current.setLoop(false).catch(() => {});
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
  }, []);

  useEffect(() => {
    // Apply class to body for Tailwind variant targeting
    if (isEagleVision) {
      document.body.classList.add('eagle-vision-active');
      playToggleSound();
    } else {
      document.body.classList.remove('eagle-vision-active');
    }
  }, [isEagleVision]);

  const playToggleSound = () => {
    if (playerRef.current) {
      // Reset time to 0 to allow replay
      playerRef.current.setCurrentTime(0).catch(() => {});
      playerRef.current.play().catch((e: any) => console.error("SFX Play failed", e));
    }
  };

  const toggleEagleVision = () => {
    setIsEagleVision(prev => !prev);
  };

  return (
    <EagleVisionContext.Provider value={{ isEagleVision, toggleEagleVision }}>
      {children}
      {/* Hidden SFX Player - Vimeo ID: 1140026271 */}
      <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1140026271?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&loop=0"
          style={{ 
            position: 'fixed', 
            width: '1px', 
            height: '1px', 
            opacity: 0.001, 
            pointerEvents: 'none',
            bottom: 0,
            right: 0,
            zIndex: -1,
            visibility: 'hidden'
          }}
          allow="autoplay"
          title="Eagle Vision SFX"
      />
    </EagleVisionContext.Provider>
  );
};

export const useEagleVision = () => {
  const context = useContext(EagleVisionContext);
  if (context === undefined) {
    throw new Error('useEagleVision must be used within an EagleVisionProvider');
  }
  return context;
};
