"use client";

interface LevelCompleteProps {
  level: number;
  score: number;
  onContinue: () => void;
}

export function LevelComplete({
  level,
  score,
  onContinue,
}: LevelCompleteProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-complete-title"
    >
      <div className="vault-panel max-w-sm animate-glitch-in p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--neon-pink)]">
          Synapse Vault
        </p>
        <h2
          id="level-complete-title"
          className="font-display mt-2 text-3xl font-bold text-[var(--neon-cyan)]"
        >
          Sector Cleared
        </h2>
        <p className="mt-4 font-mono text-sm text-white/70">
          Level {level} complete · {score} points
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="neon-button mt-8 w-full"
        >
          Continue to Level {level + 1}
        </button>
      </div>
    </div>
  );
}
