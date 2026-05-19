const LEVEL_KEY = "anagram-level";
const SCORE_KEY = "anagram-best-scores";

export function loadSavedLevel(): number {
  if (typeof window === "undefined") return 1;
  const raw = localStorage.getItem(LEVEL_KEY);
  const parsed = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export function saveLevel(level: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEVEL_KEY, String(level));
}

export function saveBestScore(level: number, score: number): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(SCORE_KEY);
  const map: Record<string, number> = raw ? JSON.parse(raw) : {};
  const key = String(level);
  if (!map[key] || score > map[key]) {
    map[key] = score;
    localStorage.setItem(SCORE_KEY, JSON.stringify(map));
  }
}
