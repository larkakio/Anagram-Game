"use client";

import type { HexCell } from "@/lib/game/types";
import { hexToPixel } from "@/lib/game/hex";

interface SwipeTrailProps {
  path: number[];
  cells: HexCell[];
  hexSize: number;
  offsetX: number;
  offsetY: number;
  flash?: "success" | "error" | null;
}

export function SwipeTrail({
  path,
  cells,
  hexSize,
  offsetX,
  offsetY,
  flash,
}: SwipeTrailProps) {
  if (path.length < 2) return null;

  const points = path
    .map((id) => cells.find((c) => c.id === id))
    .filter(Boolean)
    .map((cell) => {
      const { x, y } = hexToPixel(cell!.q, cell!.r, hexSize);
      return `${x + offsetX},${y + offsetY}`;
    })
    .join(" ");

  const stroke =
    flash === "error"
      ? "#ff2a6d"
      : flash === "success"
        ? "#00fff0"
        : "url(#trailGradient)";

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00fff0" />
          <stop offset="50%" stopColor="#ff2a6d" />
          <stop offset="100%" stopColor="#f9f002" />
        </linearGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neonGlow)"
        className={flash === "error" ? "animate-shake" : ""}
      />
    </svg>
  );
}
