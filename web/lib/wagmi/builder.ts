import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

export function getBuilderDataSuffix(): Hex | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (override?.startsWith("0x")) {
    return override as Hex;
  }

  const code = process.env.NEXT_PUBLIC_BUILDER_CODE;
  if (!code) return undefined;

  try {
    return Attribution.toDataSuffix({ codes: [code] });
  } catch {
    return undefined;
  }
}
