"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  advanceLevel,
  applySwipeResult,
  createInitialState,
  validateSwipe,
} from "@/lib/game/engine";
import { buildLevel, minSwipeLength } from "@/lib/game/levels";
import { loadSavedLevel, saveBestScore, saveLevel } from "@/lib/game/storage";
import type { GameState } from "@/lib/game/types";
import { GameHUD } from "./GameHUD";
import { HexGrid } from "./HexGrid";
import { LevelComplete } from "./LevelComplete";

export function AnagramGame() {
  const [levelNum, setLevelNum] = useState(1);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(1),
  );
  const [path, setPath] = useState<number[]>([]);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [hintedCellId, setHintedCellId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const level = useMemo(() => buildLevel(levelNum), [levelNum]);

  useEffect(() => {
    const saved = loadSavedLevel();
    setLevelNum(saved);
    setGameState(createInitialState(saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!level.timeLimitSec) {
      setTimeLeft(null);
      return;
    }
    setTimeLeft(level.timeLimitSec);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [level.level, level.timeLimitSec]);

  const handleSubmit = useCallback(
    (submittedPath: number[]) => {
      const result = validateSwipe(submittedPath, level, gameState);
      setPath([]);

      if (!result.valid) {
        setFlash("error");
        setTimeout(() => setFlash(null), 400);
        if (!result.alreadyFound) {
          setGameState((s) => applySwipeResult(s, result));
        }
        return;
      }

      setFlash("success");
      const nextState = applySwipeResult(gameState, result);
      setGameState(nextState);
      saveBestScore(levelNum, nextState.score);

      setTimeout(() => setFlash(null), 400);

      if (result.levelComplete) {
        setShowComplete(true);
        const nextLevel = levelNum + 1;
        saveLevel(nextLevel);
        setTimeout(() => {
          setShowComplete(false);
          setLevelNum(nextLevel);
          setGameState(advanceLevel(nextState));
          setHintedCellId(null);
        }, 1200);
      }
    },
    [level, gameState, levelNum],
  );

  const handleHint = () => {
    if (gameState.hintsUsed >= 1) return;
    const target = level.targets.find(
      (t) => !gameState.foundWords.includes(t.toUpperCase()),
    );
    if (!target) return;
    const letter = target[0];
    const cell = level.cells.find((c) => c.letter === letter);
    if (cell) {
      setHintedCellId(cell.id);
      setGameState((s) => ({ ...s, hintsUsed: s.hintsUsed + 1 }));
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-mono text-[var(--neon-cyan)]">
        Initializing vault…
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <GameHUD
        level={levelNum}
        score={gameState.score}
        foundWords={gameState.foundWords}
        targets={level.targets}
        timeLeft={timeLeft}
      />

      <p className="text-center font-mono text-xs text-white/50">
        Swipe adjacent hex letters to spell each target word
      </p>

      <HexGrid
        cells={level.cells}
        path={path}
        minSwipeLength={minSwipeLength(level, gameState.foundWords)}
        onPathChange={setPath}
        onSubmit={handleSubmit}
        hintedCellId={hintedCellId}
        flash={flash}
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleHint}
          disabled={gameState.hintsUsed >= 1}
          className="neon-button-outline text-sm disabled:opacity-40"
        >
          {gameState.hintsUsed >= 1 ? "No hints left" : "Reveal letter"}
        </button>
      </div>

      {showComplete && (
        <LevelComplete
          level={levelNum}
          score={gameState.score}
          onContinue={() => {
            const next = levelNum + 1;
            setShowComplete(false);
            setLevelNum(next);
            setGameState(createInitialState(next));
          }}
        />
      )}
    </section>
  );
}
