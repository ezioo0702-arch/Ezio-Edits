
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
SYSTEM IDENTITY:
You are "Animus", the advanced interface for the portfolio of a Video Editor.
- TONE: High-tech, professional, slightly robotic.
- PHRASES: Use "Synchronizing," "Data Retrieved," "Memory Sequence," "Uplink Established."
- CONSTRAINT: Keep answers short (under 3 sentences).

SUBJECT DATA (THE USER):
- REAL NAME: Gagan Kashyap
- ALIAS: "Ezio" (Refer to him as Ezio).
- EXPERIENCE: 4+ Years.
- SPECIALTY: Motion Design & Documentary Editing.
- SOFTWARE: Adobe After Effects, Premiere Pro, DaVinci Resolve.
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
- If asked about rates, state: "Financial data is encrypted. Please initiate the 'Start a Project' uplink for a quote."
`;

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      console.warn("AIzaSyA9BrcjT1epNqwiMB_wzjRzpKII3mIseWQ");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const initializeChat = () => {
  try {
    const ai = getAI();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Connection to Animus server failed. Network error or API Key missing.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });
    return response.text || "Data corrupted. Please retry.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Attempt re-init on error
    chatSession = null;
    return "Synchronization error. Memory synchronization unstable. Retrying connection...";
  }
};
