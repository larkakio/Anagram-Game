import { AnagramGame } from "@/components/game/AnagramGame";
import { CheckInPanel } from "@/components/CheckInPanel";
import { WalletBar } from "@/components/WalletBar";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-6 shrink-0">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[var(--neon-pink)]">
              Base · Synapse Vault
            </p>
            <h1 className="font-display text-2xl font-black uppercase tracking-wide text-[var(--neon-cyan)] glitch-text">
              Anagram Game
            </h1>
          </div>
          <WalletBar />
        </div>
        <CheckInPanel />
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnagramGame />
      </main>

      <footer className="mt-8 shrink-0 text-center font-mono text-[10px] text-white/30">
        Swipe the cipher grid · Optional daily check-in on Base
      </footer>
    </div>
  );
}
