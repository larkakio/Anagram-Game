"use client";

import { useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import {
  dailyCheckInAbi,
  dailyCheckInAddress,
} from "@/lib/contracts/abi";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;

export function CheckInPanel() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const contractReady =
    dailyCheckInAddress.toLowerCase() !== ZERO_ADDRESS.toLowerCase();

  const today = Math.floor(Date.now() / 1000 / 86400) + 1;

  const { data: lastDay, refetch } = useReadContract({
    address: dailyCheckInAddress,
    abi: dailyCheckInAbi,
    functionName: "lastCheckInDay",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && contractReady && Boolean(address),
    },
  });

  const { data: streak } = useReadContract({
    address: dailyCheckInAddress,
    abi: dailyCheckInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && contractReady && Boolean(address),
    },
  });

  const alreadyCheckedIn = useMemo(() => {
    if (lastDay === undefined) return false;
    return Number(lastDay) === today;
  }, [lastDay, today]);

  const handleCheckIn = async () => {
    if (!isConnected) return;
    const baseId = base.id;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }
    await writeContractAsync({
      address: dailyCheckInAddress,
      abi: dailyCheckInAbi,
      functionName: "checkIn",
      chainId: baseId,
    });
    await refetch();
  };

  if (!contractReady) return null;
  if (!isConnected) return null;

  return (
    <div className="vault-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
          Daily on-chain check-in
        </p>
        <p className="font-mono text-xs text-[var(--neon-yellow)]">
          Streak: {streak !== undefined ? String(streak) : "—"} · Gas only on Base
        </p>
      </div>
      <button
        type="button"
        className="neon-button px-4 py-2 text-xs disabled:opacity-50"
        disabled={
          alreadyCheckedIn || isWriting || isSwitching || !contractReady
        }
        onClick={handleCheckIn}
      >
        {alreadyCheckedIn
          ? "Checked in today"
          : isSwitching
            ? "Switching network…"
            : isWriting
              ? "Confirm in wallet…"
              : "Daily Check-In"}
      </button>
    </div>
  );
}
