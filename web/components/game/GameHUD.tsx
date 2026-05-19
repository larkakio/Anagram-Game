"use client";

interface GameHUDProps {
  level: number;
  score: number;
  foundWords: string[];
  targets: string[];
  timeLeft: number | null;
}

export function GameHUD({
  level,
  score,
  foundWords,
  targets,
  timeLeft,
}: GameHUDProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-2">
        <span className="font-display text-xs uppercase tracking-[0.2em] text-[var(--neon-yellow)]">
          Sector
        </span>
        <span className="font-display text-2xl font-bold text-[var(--neon-cyan)] glitch-text">
          {String(level).padStart(2, "0")}
        </span>
      </div>
      <div className="text-right">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
          Score
        </p>
        <p className="font-mono text-xl text-[var(--neon-cyan)]">{score}</p>
      </div>
      {timeLeft !== null && (
        <div className="rounded border border-[var(--neon-pink)]/40 bg-black/40 px-3 py-1">
          <p className="font-mono text-xs text-[var(--neon-pink)]">
            {timeLeft}s
          </p>
        </div>
      )}
      <div className="w-full">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
          Targets
        </p>
        <div className="flex flex-wrap gap-2">
          {targets.map((target) => {
            const done = foundWords.includes(target.toUpperCase());
            return (
              <span
                key={target}
                className={`rounded px-2 py-0.5 font-mono text-xs ${
                  done
                    ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] line-through"
                    : "border border-white/20 text-white/70"
                }`}
              >
                {target}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
