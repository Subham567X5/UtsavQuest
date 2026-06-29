export enum GameStage {
  GIFT = "GIFT",
  CAKE = "CAKE",
  BALLOONS = "BALLOONS",
  CATCHER = "CATCHER",
  REVEAL = "REVEAL"
}

export interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  word: string;
  size: number;
  popped: boolean;
}

export interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'gift' | 'flower' | 'cake' | 'star' | 'stress';
  size: number;
  speed: number;
  angle: number;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  date: string;
  author: string;
}

export interface NoteItem {
  note: string;
  duration: number; // in beats
}
