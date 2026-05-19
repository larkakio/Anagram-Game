import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

/**
 * ERC-8021 Builder Code attribution for Base.
 * @see https://docs.base.org/apps/builder-codes/app-developers
 *
 * Prefer NEXT_PUBLIC_BUILDER_CODE (e.g. bc_aqeu7aw5) — suffix is generated via ox.
 * Use NEXT_PUBLIC_BUILDER_CODE_SUFFIX only if you paste the hex from Base dashboard.
 */
export const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BUILDER_CODE?.trim() || "bc_aqeu7aw5";

export function getBuilderDataSuffix(): Hex | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX?.trim();
  if (override?.startsWith("0x")) {
    return override as Hex;
  }

  if (!BUILDER_CODE) return undefined;

  try {
    return Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[builder] Invalid NEXT_PUBLIC_BUILDER_CODE:", error);
    }
    return undefined;
  }
}
