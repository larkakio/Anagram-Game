import { getLayout } from "./hex";
import type { HexCell, LevelConfig } from "./types";
import { buildLetterPool, pickWord } from "./words";

/** Level 1: guaranteed swipe path N→E→O→N on adjacent hexes */
function buildLevelOne(): LevelConfig {
  const layout = getLayout(7);
  const letterByCoord = new Map<string, string>([
    ["-1,0", "N"],
    ["0,0", "E"],
    ["1,0", "O"],
    ["1,-1", "N"],
    ["0,1", "X"],
    ["0,-1", "Z"],
    ["-1,1", "K"],
  ]);

  const cells: HexCell[] = layout.map((coord, id) => ({
    id,
    q: coord.q,
    r: coord.r,
    letter: letterByCoord.get(`${coord.q},${coord.r}`) ?? "A",
  }));

  return {
    level: 1,
    targets: ["NEON"],
    cells,
    decoyCount: 0,
    timeLimitSec: null,
  };
}

function cellCountForLevel(level: number): number {
  if (level === 1) return 7;
  if (level === 2) return 9;
  if (level === 3) return 11;
  if (level <= 10) return 11 + Math.min(level - 4, 2);
  return 19;
}

function targetsForLevel(level: number): string[] {
  if (level === 2) return [pickWord(5, level)];
  if (level === 3) return [pickWord(4, level), pickWord(4, level + 3)];
  if (level <= 10) {
    const len = level % 2 === 0 ? 6 : 5;
    if (level % 3 === 0) {
      return [pickWord(5, level), pickWord(5, level + 1)];
    }
    return [pickWord(len, level)];
  }
  const len = 6 + (level % 2);
  return [pickWord(len, level)];
}

function decoysForLevel(level: number): number {
  if (level === 1) return 0;
  if (level === 2) return 1;
  if (level === 3) return 2;
  return Math.min(1 + Math.floor(level / 3), 5);
}

function timeLimitForLevel(level: number): number | null {
  if (level === 1) return null;
  if (level <= 3) return 90;
  if (level <= 10) return 75;
  return 60;
}

export function buildLevel(level: number): LevelConfig {
  if (level === 1) return buildLevelOne();

  const cellCount = cellCountForLevel(level);
  const targets = targetsForLevel(level);
  const decoyCount = decoysForLevel(level);
  const layout = getLayout(cellCount);
  const letters = buildLetterPool(targets, cellCount, decoyCount, level * 97);

  const cells: HexCell[] = layout.map((coord, id) => ({
    id,
    q: coord.q,
    r: coord.r,
    letter: letters[id] ?? "A",
  }));

  return {
    level,
    targets,
    cells,
    decoyCount,
    timeLimitSec: timeLimitForLevel(level),
  };
}

export function minSwipeLength(
  level: LevelConfig,
  foundWords: string[] = [],
): number {
  const remaining = level.targets.filter(
    (t) => !foundWords.includes(t.toUpperCase()),
  );
  if (remaining.length === 0) return 3;
  return Math.min(...remaining.map((t) => t.length));
}
