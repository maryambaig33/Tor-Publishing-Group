export enum Character {
  BARD = 'BARD',
  BRIGAND = 'BRIGAND',
  GOAT = 'GOAT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioData?: string; // Base64 PCM data
  isThinking?: boolean;
}

export interface BookReview {
  id: number;
  author: string;
  text: string;
  source: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
