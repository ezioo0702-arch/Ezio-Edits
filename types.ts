
export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  videoUrl?: string; // Optional for this demo
  description: string;
  software?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum AppSection {
  HERO = 'hero',
  WORK = 'work',
  ABOUT = 'about',
  CONTACT = 'contact'
}
