export interface HexCoord {
  q: number;
  r: number;
}

export interface HexCell {
  id: number;
  q: number;
  r: number;
  letter: string;
}

export interface LevelConfig {
  level: number;
  targets: string[];
  cells: HexCell[];
  decoyCount: number;
  timeLimitSec: number | null;
}

export interface GameState {
  level: number;
  score: number;
  foundWords: string[];
  swipeStreak: number;
  hintsUsed: number;
  startedAt: number;
}

export interface SwipeResult {
  valid: boolean;
  word: string;
  alreadyFound: boolean;
  levelComplete: boolean;
  points: number;
}
