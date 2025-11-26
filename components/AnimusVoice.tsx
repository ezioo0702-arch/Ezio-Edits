import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, type Blob as GenAIBlob } from "@google/genai";
import { Mic, MicOff, Activity, Power, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion component to any to avoid type errors in this environment
const MDiv = motion.div as any;

// --- Helper Functions for Audio Encoding/Decoding ---

function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  // Custom manual encoding to avoid external library dependencies
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Component ---

const SYSTEM_INSTRUCTION = `
SYSTEM IDENTITY:
      You are "Animus", the advanced interface for the portfolio of a Video Editor.
      - TONE: High-tech, professional, slightly robotic.
      - PHRASES: Use "Synchronizing," "Data Retrieved," "Memory Sequence."
      - CONSTRAINT: Keep answers short (under 3 sentences).

      SUBJECT DATA (THE USER):
      - REAL NAME: Gagan Kashyap
      - ALIAS: "Ezio" (Refer to him as Ezio).
      - EXPERIENCE: 4+ Years.
      - SPECIALTY: Motion Design & Documentary Editing.
      - SOFTWARE: Adobe After Effects, Premiere Pro.
      - KEY TRAIT: Revenue-Focused (He generates ROI/Views for clients).

      ALLIANCES (CLIENT LIST):
      - Gagiegram
      - Iamlucid
      - Whaletrading
      - (And various other high-profile entities).

      INSTRUCTIONS:
      - If asked "Who is this?", reply with his alias and experience level.
      - If asked about "Style", mention his proficiency in motion design and pacing.
      - If asked "Why hire him?", emphasize that he doesn't just edit; he creates revenue-generating content.
      `;

export const AnimusVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Audio Context Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanupAudio = () => {
    // Stop all playing sources
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    audioSourcesRef.current.clear();

    // Close microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Disconnect nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close contexts
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }

    if (sessionRef.current) {
        // There is no explicit close method on the promise wrapper, 
        // but we drop the reference. The socket closes when we stop sending/receiving typically 
        // or if we could call close on the session object if exposed.
        sessionRef.current = null;
    }
    
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    setError(null);
    setStatus('connecting');

    try {
      if (!process.env.API_KEY) throw new Error("API Key Missing");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      // Input: 16kHz for speech recognition optimization
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      // Output: 24kHz matches Gemini's default output
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Get Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const connectPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } // Charon sounds deeper/more authoritative
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: async () => {
            setStatus('listening');
            
            // Setup Input Pipeline
            if (!inputContextRef.current || !streamRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            
            // Use ScriptProcessor for raw PCM access (standard for this API usage)
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              // Send to Gemini
              connectPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!outputContextRef.current) return;

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              
              try {
                // Determine start time to ensure gapless playback
                const currentTime = outputContextRef.current.currentTime;
                if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                }

                const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  outputContextRef.current,
                  24000,
                  1
                );

                const source = outputContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputContextRef.current.destination);
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                
                audioSourcesRef.current.add(source);
                source.onended = () => {
                  audioSourcesRef.current.delete(source);
                  if (audioSourcesRef.current.size === 0) {
                     setStatus('listening');
                  }
                };
              } catch (e) {
                console.error("Audio decode error", e);
              }
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
                audioSourcesRef.current.forEach(src => src.stop());
                audioSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setStatus('listening');
            }
          },
          onclose: () => {
            setStatus('idle');
            setIsActive(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            setError("Connection Severed");
            setStatus('idle');
            setIsActive(false);
            cleanupAudio();
          }
        }
      });
      
      sessionRef.current = connectPromise;

    } catch (err) {
      console.error("Failed to start session:", err);
      setError("Audio Uplink Failed");
      setStatus('idle');
      setIsActive(false);
      cleanupAudio();
    }
  };

  const toggleSession = () => {
    if (isActive) {
      cleanupAudio();
      setIsActive(false);
      setStatus('idle');
    } else {
      setIsActive(true);
      startSession();
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-40 font-sans">
        <AnimatePresence>
            {isActive && (
                <MDiv
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="absolute bottom-0 right-16 mb-2 flex flex-col items-end gap-2 pointer-events-none"
                >
                   {/* Status Label */}
                   <div className="bg-ac-dark/90 border border-ac-red/50 px-4 py-2 backdrop-blur text-right shadow-xl">
                      <div className="flex items-center gap-2 justify-end">
                          <Activity className={`w-4 h-4 ${status === 'speaking' ? 'text-ac-red animate-pulse' : 'text-gray-500'}`} />
                          <span className="text-ac-red font-mono text-xs tracking-widest uppercase">
                            {status === 'connecting' && "Uplink..."}
                            {status === 'listening' && "Listening"}
                            {status === 'speaking' && "Transmitting"}
                            {status === 'idle' && "Standby"}
                          </span>
                      </div>
                      {error && <span className="text-red-500 text-[10px] block mt-1">{error}</span>}
                   </div>
                </MDiv>
            )}
        </AnimatePresence>

        {/* FAB */}
        <button
            onClick={toggleSession}
            className={`
                group relative w-14 h-14 flex items-center justify-center rounded-full border transition-all duration-300 shadow-2xl
                ${isActive 
                    ? 'bg-ac-red border-white shadow-[0_0_20px_rgba(220,38,38,0.8)]' 
                    : 'bg-ac-dark border-ac-red hover:bg-ac-red/20'
                }
            `}
        >
            {/* Visualizer Ring Effect when Active */}
            {isActive && (
                <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-20"></span>
            )}
            
            {/* Icon Switch */}
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {isActive ? (
                   status === 'connecting' ? (
                       <Zap className="w-6 h-6 text-white animate-pulse" />
                   ) : (
                       <Mic className="w-6 h-6 text-white" />
                   )
                ) : (
                   <Power className="w-6 h-6 text-ac-red group-hover:text-white transition-colors" />
                )}
            </div>
        </button>
    </div>
  );
};