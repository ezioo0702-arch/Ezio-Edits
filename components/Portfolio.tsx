
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Where I Am From',
    category: 'Story',
    thumbnailUrl: 'https://vumbnail.com/1139517617_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1139517617?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: "The objective is to produce a powerful, three-act personal documentary detailing the host's Lebanese root.",
    software: ['Premiere Pro', 'After Effects', 'Midjourney']
  },
  {
    id: '2',
    title: 'Lucid Sample',
    category: 'Sample Video',
    thumbnailUrl: 'https://vumbnail.com/1139519581_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1139519581?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'An experimental visual piece blending surreal imagery with precise rhythmic editing to evoke a lucid dream state.',
    software: ['After Effects', 'DaVinci Resolve']
  },
  {
    id: '3',
    title: 'Lucid Sample',
    category: 'Vlog sample',
    thumbnailUrl: 'https://vumbnail.com/1139520899_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1139520899?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'Preview of a vlog',
    software: ['Premiere Pro', 'After Effects']
  },
  {
    id: '4',
    title: 'Animation remake',
    category: 'Motion Graphics',
    thumbnailUrl: 'https://vumbnail.com/1139524804_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1139524804?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'Motion graphics made using After effects.',
    software: ['After effects']
  },
  {
    id: '5',
    title: 'UI animation',
    category: 'Motion Graphics',
    thumbnailUrl: 'https://vumbnail.com/1139527854_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1139527854?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'Motion graphics made using After effects.',
    software: ['Premiere Pro', 'After Effects']
  },
  {
    id: '6',
    title: 'Advertisement',
    category: 'Motion Graphics',
    thumbnailUrl: 'https://vumbnail.com/1140292564_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1140292564?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'Motion graphics made using After effects.',
    software: ['After Effects', 'Blender']
  },
  {
    id: '7',
    title: 'Von',
    category: 'Vertical Edit',
    thumbnailUrl: 'https://vumbnail.com/1140020441_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1140020441?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'A vertical format visual experience showcasing rhythmic editing and composition.',
    software: ['Premiere Pro', 'After Effects']
  },
  {
    id: '8',
    title: 'Gagiegram',
    category: 'Vertical Edit',
    thumbnailUrl: 'https://vumbnail.com/1140301319_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1140301319?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'High-energy vertical content tailored for maximum social media engagement and retention.',
    software: ['Premiere Pro', 'After Effects']
  },
  {
    id: '9',
    title: 'Papa Pizzeria',
    category: 'Documentary',
    thumbnailUrl: 'https://vumbnail.com/1140303734_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1140303734?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'A story about Papa Pizzeria franchise',
    software: ['Premiere Pro', 'After Effects']
  },
  {
    id: '10',
    title: 'Papa Pizzeria',
    category: 'Documentary',
    thumbnailUrl: 'https://vumbnail.com/1140702801_large.jpg',
    videoUrl: 'https://player.vimeo.com/video/1140702801?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1',
    description: 'A story about Papa Pizzeria franchise',
    software: ['Premiere Pro', 'After Effects']
  }
];

const cardVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    y: 300, // Simulating the y: 1000 effect (scaled for React viewports)
    rotate: index % 2 === 0 ? -45 : 45, // Left items rotate left, right items rotate right
    scale: 0.8,
  }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // 'power4.out' equivalent
    }
  }
};

// Cast motion components to any to avoid type errors in this environment
const MDiv = motion.div as any;

export const Portfolio: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Custom Video Controls State
  const [progress, setProgress] = useState(0); // 0 to 100
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const selectedProject = PROJECTS.find(p => p.id === selectedId);

  // Initialize Vimeo Player when modal opens and video is playing
  useEffect(() => {
    if (selectedId && isPlaying && iframeRef.current && window.Vimeo) {
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;

      player.getDuration().then((d: number) => {
        setDuration(d);
      });

      const onTimeUpdate = (data: { seconds: number; percent: number; duration: number }) => {
        if (!isDragging) {
          setCurrentTime(data.seconds);
          setProgress(data.percent * 100);
        }
      };

      player.on('timeupdate', onTimeUpdate);

      return () => {
        player.off('timeupdate', onTimeUpdate);
        playerRef.current = null;
      };
    }
  }, [selectedId, isPlaying, isDragging]);

  // Handle global mouse up to stop dragging even if mouse is outside the timeline
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Seek to final position
        if (playerRef.current) {
          playerRef.current.setCurrentTime((progress / 100) * duration);
        }
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        let newPercent = (offsetX / rect.width) * 100;
        newPercent = Math.max(0, Math.min(100, newPercent));
        setProgress(newPercent);
      }
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, progress, duration]);


  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let newPercent = (offsetX / rect.width) * 100;
      newPercent = Math.max(0, Math.min(100, newPercent));
      setProgress(newPercent);
    }
  };

  useEffect(() => {
    if (!selectedId) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [selectedId]);

  return (
    <section id="work" className="py-32 px-4 md:px-12 bg-ac-dark relative overflow-hidden scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <MDiv 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-baseline justify-between mb-24 border-b border-gray-800 pb-6"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">SELECTED WORKS</h2>
          <span className="text-ac-red font-mono text-sm">[001 - 010]</span>
        </MDiv>

        {/* Grid changed to strictly 2 columns on desktop to match the Left/Right animation logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32 perspective-1000">
          {PROJECTS.map((project, index) => (
            <MDiv
              key={project.id}
              layoutId={project.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }} // Triggers when 10% into view
              onClick={() => setSelectedId(project.id)}
              className="group relative cursor-pointer w-full"
            >
              <div className="overflow-hidden aspect-[4/3] relative shadow-2xl bg-gray-900 transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <img 
                  src={project.thumbnailUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-ac-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-ac-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 bg-black/30 backdrop-blur-sm">
                   <Play className="fill-white text-white w-6 h-6 ml-1" />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-end border-b border-gray-800 pb-4 group-hover:border-ac-red transition-colors duration-500">
                <div>
                  <p className="text-ac-red text-xs tracking-[0.2em] uppercase mb-2 font-mono">{project.category}</p>
                  <h3 className="text-3xl font-serif font-bold text-white group-hover:translate-x-2 transition-transform duration-300">{project.title}</h3>
                </div>
                <span className="text-gray-600 font-mono text-sm group-hover:text-white transition-colors">{index < 9 ? `0${index + 1}` : index + 1}</span>
              </div>
            </MDiv>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && selectedProject && (
            <MDiv 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MDiv 
                layoutId={selectedId}
                className="w-full max-w-5xl bg-ac-gray border border-gray-800 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                  className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-ac-red transition-colors text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Video Container */}
                <div className="relative aspect-video bg-black group shrink-0">
                   {isPlaying && selectedProject.videoUrl ? (
                      <>
                        <iframe
                          ref={iframeRef}
                          src={selectedProject.videoUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={selectedProject.title}
                        />
                        {/* Custom Controls Layer */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/90 to-transparent flex items-end px-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {/* Timeline Track */}
                          <div 
                            ref={timelineRef}
                            className="relative w-full h-1.5 bg-gray-700/50 cursor-pointer rounded-full mb-2 group/timeline"
                            onMouseDown={handleTimelineMouseDown}
                          >
                            {/* Buffered/Progress Bar */}
                            <div 
                              className="absolute top-0 left-0 h-full bg-ac-red rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                            {/* Handle */}
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-0 group-hover/timeline:scale-100 transition-transform duration-200"
                              style={{ left: `${progress}%`, marginLeft: '-6px' }}
                            />
                          </div>
                        </div>
                      </>
                   ) : (
                     <>
                       <img 
                        src={selectedProject.thumbnailUrl} 
                        className="w-full h-full object-cover opacity-50"
                        alt={selectedProject.title}
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div 
                            onClick={() => setIsPlaying(true)}
                            className="w-20 h-20 bg-ac-red rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.6)]"
                          >
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                         </div>
                       </div>
                     </>
                   )}
                </div>

                <div className="p-8 md:p-10 overflow-y-auto">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-white mb-2">{selectedProject.title}</h3>
                      <p className="text-ac-red uppercase tracking-wider text-sm font-mono">{selectedProject.category}</p>
                    </div>
                    <div className="flex gap-2">
                      {(selectedProject.software || ['Premiere', 'After Effects']).map(tag => (
                        <span key={tag} className="px-3 py-1 border border-gray-700 text-gray-400 text-xs uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-white font-bold mb-2 text-sm uppercase">Mission Brief</h4>
                    <p className="text-gray-400 leading-relaxed max-w-2xl">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>
              </MDiv>
            </MDiv>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
