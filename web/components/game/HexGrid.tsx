"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { areHexAdjacent, hexToPixel } from "@/lib/game/hex";
import type { HexCell } from "@/lib/game/types";
import { SwipeTrail } from "./SwipeTrail";

interface HexGridProps {
  cells: HexCell[];
  path: number[];
  minSwipeLength?: number;
  onPathChange: (path: number[]) => void;
  onSubmit: (path: number[]) => void;
  hintedCellId: number | null;
  flash?: "success" | "error" | null;
}

const HEX_SIZE = 36;

export function HexGrid({
  cells,
  path,
  onPathChange,
  onSubmit,
  hintedCellId,
  flash,
  minSwipeLength = 3,
}: HexGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePointer, setActivePointer] = useState<number | null>(null);

  const layout = useMemo(() => {
    const positions = cells.map((cell) => ({
      cell,
      ...hexToPixel(cell.q, cell.r, HEX_SIZE),
    }));
    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX + HEX_SIZE * 2;
    const height = maxY - minY + HEX_SIZE * 2;
    const offsetX = -minX + HEX_SIZE;
    const offsetY = -minY + HEX_SIZE;
    return { positions, width, height, offsetX, offsetY };
  }, [cells]);

  const hitTest = useCallback(
    (clientX: number, clientY: number): number | null => {
      const el = containerRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let closest: { id: number; dist: number } | null = null;
      for (const { cell, x: cx, y: cy } of layout.positions) {
        const px = cx + layout.offsetX;
        const py = cy + layout.offsetY;
        const dist = Math.hypot(x - px, y - py);
        if (dist < HEX_SIZE * 0.95 && (!closest || dist < closest.dist)) {
          closest = { id: cell.id, dist };
        }
      }
      return closest?.id ?? null;
    },
    [layout],
  );

  const extendPath = useCallback(
    (cellId: number) => {
      if (path.length === 0) {
        onPathChange([cellId]);
        return;
      }
      const lastId = path[path.length - 1];
      if (cellId === lastId) return;

      if (path.length >= 2 && path[path.length - 2] === cellId) {
        onPathChange(path.slice(0, -1));
        return;
      }

      if (path.includes(cellId)) return;

      const last = cells.find((c) => c.id === lastId);
      const next = cells.find((c) => c.id === cellId);
      if (last && next && areHexAdjacent(last, next)) {
        onPathChange([...path, cellId]);
      }
    },
    [path, cells, onPathChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    containerRef.current?.setPointerCapture(e.pointerId);
    setActivePointer(e.pointerId);
    const id = hitTest(e.clientX, e.clientY);
    if (id !== null) onPathChange([id]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointer !== e.pointerId) return;
    const id = hitTest(e.clientX, e.clientY);
    if (id !== null) extendPath(id);
  };

  const endStroke = () => {
    setActivePointer(null);
    if (path.length >= minSwipeLength) onSubmit([...path]);
    else onPathChange([]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activePointer !== e.pointerId) return;
    endStroke();
  };

  const handlePointerCancel = () => {
    setActivePointer(null);
    onPathChange([]);
  };

  const currentWord = path
    .map((id) => cells.find((c) => c.id === id)?.letter ?? "")
    .join("");

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div
        ref={containerRef}
        className="relative touch-none select-none"
        style={{
          width: layout.width,
          height: layout.height,
          margin: "0 auto",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="application"
        aria-label="Letter hex grid. Swipe through adjacent letters to spell words."
      >
        <SwipeTrail
          path={path}
          cells={cells}
          hexSize={HEX_SIZE}
          offsetX={layout.offsetX}
          offsetY={layout.offsetY}
          flash={flash}
        />
        {layout.positions.map(({ cell, x, y }) => {
          const selected = path.includes(cell.id);
          const isHint = hintedCellId === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              tabIndex={-1}
              className={`hex-cell absolute flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center font-mono text-lg font-bold transition-all duration-150 ${
                selected
                  ? "hex-cell--active scale-110"
                  : isHint
                    ? "hex-cell--hint"
                    : "hex-cell--idle"
              }`}
              style={{
                left: x + layout.offsetX,
                top: y + layout.offsetY,
              }}
              aria-hidden
            >
              {cell.letter}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center font-mono text-sm tracking-[0.35em] text-[var(--neon-cyan)]">
        {currentWord || "SWIPE LETTERS"}
      </p>
    </div>
  );
}
