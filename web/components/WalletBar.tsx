"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";

export function WalletBar() {
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== base.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  const sheet = sheetOpen && mounted && (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/70"
      role="presentation"
      onClick={() => setSheetOpen(false)}
    >
      <div
        className="vault-panel mx-auto w-full max-w-lg rounded-t-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Connect wallet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-[var(--neon-cyan)]">
            Connect Wallet
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="text-white/60 hover:text-white"
            onClick={() => setSheetOpen(false)}
          >
            ✕
          </button>
        </div>
        <ul className="mb-[env(safe-area-inset-bottom)] max-h-[50vh] space-y-2 overflow-y-auto">
          {connectors.length === 0 ? (
            <li className="font-mono text-sm text-white/60">
              No wallets detected. Open in a wallet browser or install an
              extension.
            </li>
          ) : (
            connectors.map((connector) => (
              <li key={connector.uid}>
                <button
                  type="button"
                  className="neon-button-outline w-full text-left"
                  disabled={isPending}
                  onClick={() => {
                    connect({ connector, chainId: base.id });
                    setSheetOpen(false);
                  }}
                >
                  {connector.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {wrongNetwork && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--neon-pink)]/50 bg-[var(--neon-pink)]/10 px-3 py-2">
          <span className="font-mono text-xs text-[var(--neon-pink)]">
            Wrong network — switch to Base
          </span>
          <button
            type="button"
            className="neon-button-outline px-3 py-1 text-xs"
            onClick={() => switchChain({ chainId: base.id })}
          >
            Switch to Base
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <span className="hidden font-mono text-xs text-white/60 sm:inline">
              {shortAddress}
            </span>
            <button
              type="button"
              className="neon-button-outline px-3 py-1.5 text-xs"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            className="neon-button px-4 py-1.5 text-xs"
            onClick={() => setSheetOpen(true)}
          >
            Connect wallet
          </button>
        )}
      </div>
      {mounted && sheet && createPortal(sheet, document.body)}
    </>
  );
}
