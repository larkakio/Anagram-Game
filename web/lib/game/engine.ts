import { areHexAdjacent } from "./hex";
import type { GameState, HexCell, LevelConfig, SwipeResult } from "./types";

export function createInitialState(level: number): GameState {
  return {
    level,
    score: 0,
    foundWords: [],
    swipeStreak: 0,
    hintsUsed: 0,
    startedAt: Date.now(),
  };
}

export function pathToWord(path: number[], cells: HexCell[]): string {
  return path.map((id) => cells.find((c) => c.id === id)?.letter ?? "").join("");
}

export function isValidPath(
  path: number[],
  cells: HexCell[],
  minLength = 3,
): boolean {
  if (path.length < minLength) return false;
  const unique = new Set(path);
  if (unique.size !== path.length) return false;

  for (let i = 1; i < path.length; i++) {
    const prev = cells.find((c) => c.id === path[i - 1]);
    const curr = cells.find((c) => c.id === path[i]);
    if (!prev || !curr || !areHexAdjacent(prev, curr)) return false;
  }
  return true;
}

export function calculatePoints(
  word: string,
  swipeStreak: number,
  timeLimitSec: number | null,
  elapsedMs: number,
): number {
  const base = word.length * 10;
  const streakBonus = Math.min(swipeStreak, 5) * 5;
  let timeBonus = 0;
  if (timeLimitSec) {
    const remaining = Math.max(0, timeLimitSec * 1000 - elapsedMs);
    timeBonus = Math.floor(remaining / 1000);
  }
  return base + streakBonus + timeBonus;
}

export function validateSwipe(
  path: number[],
  level: LevelConfig,
  state: GameState,
): SwipeResult {
  const word = pathToWord(path, level.cells).toUpperCase();
  const empty: SwipeResult = {
    valid: false,
    word,
    alreadyFound: false,
    levelComplete: false,
    points: 0,
  };

  const minLen = Math.min(...level.targets.map((t) => t.length));
  if (!isValidPath(path, level.cells, minLen)) return empty;

  const normalizedTargets = level.targets.map((t) => t.toUpperCase());
  if (!normalizedTargets.includes(word)) return empty;

  if (state.foundWords.includes(word)) {
    return { ...empty, alreadyFound: true };
  }

  const elapsedMs = Date.now() - state.startedAt;
  const points = calculatePoints(
    word,
    state.swipeStreak + 1,
    level.timeLimitSec,
    elapsedMs,
  );

  const foundWords = [...state.foundWords, word];
  const levelComplete = normalizedTargets.every((t) => foundWords.includes(t));

  return {
    valid: true,
    word,
    alreadyFound: false,
    levelComplete,
    points,
  };
}

export function applySwipeResult(
  state: GameState,
  result: SwipeResult,
): GameState {
  if (!result.valid) {
    return { ...state, swipeStreak: 0 };
  }
  return {
    ...state,
    score: state.score + result.points,
    foundWords: [...state.foundWords, result.word],
    swipeStreak: state.swipeStreak + 1,
  };
}

export function advanceLevel(state: GameState): GameState {
  return createInitialState(state.level + 1);
}
