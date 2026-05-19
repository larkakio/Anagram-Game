import type { HexCoord } from "./types";

const DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function areHexAdjacent(a: HexCoord, b: HexCoord): boolean {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return DIRECTIONS.some((d) => d.q === dq && d.r === dr);
}

/** Standard honeycomb layouts by cell count */
export const HEX_LAYOUTS: Record<number, HexCoord[]> = {
  7: [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
  ],
  9: [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
    { q: 2, r: -1 },
    { q: -2, r: 1 },
  ],
  11: [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
    { q: 2, r: 0 },
    { q: -2, r: 0 },
    { q: 1, r: 1 },
    { q: -1, r: -1 },
  ],
  13: [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
    { q: 2, r: 0 },
    { q: -2, r: 0 },
    { q: 1, r: 1 },
    { q: -1, r: -1 },
    { q: 2, r: -1 },
    { q: -2, r: 1 },
  ],
  19: [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 },
    { q: 2, r: 0 },
    { q: -2, r: 0 },
    { q: 1, r: 1 },
    { q: -1, r: -1 },
    { q: 2, r: -1 },
    { q: -2, r: 1 },
    { q: 2, r: -2 },
    { q: -2, r: 2 },
    { q: 0, r: 2 },
    { q: 0, r: -2 },
    { q: 3, r: -1 },
    { q: -3, r: 1 },
  ],
};

export function hexToPixel(
  q: number,
  r: number,
  size: number,
): { x: number; y: number } {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * ((3 / 2) * r);
  return { x, y };
}

export function getLayout(cellCount: number): HexCoord[] {
  if (HEX_LAYOUTS[cellCount]) return HEX_LAYOUTS[cellCount];
  return HEX_LAYOUTS[13];
}
