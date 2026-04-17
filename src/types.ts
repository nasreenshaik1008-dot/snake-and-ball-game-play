
export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  duration: number;
}

export type Point = { x: number; y: number };

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  highScore: number;
}
