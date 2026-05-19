import { createConfig, createStorage, cookieStorage, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";
import { BUILDER_CODE, getBuilderDataSuffix } from "./builder";

const dataSuffix = getBuilderDataSuffix();

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  baseAccount({
    appName: "Anagram Game",
  }),
];

export const config = createConfig({
  chains: [base, mainnet],
  connectors,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ...(dataSuffix ? { dataSuffix } : {}),
});

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  if (dataSuffix) {
    console.info("[builder] Attribution enabled for", BUILDER_CODE);
  } else {
    console.warn("[builder] No dataSuffix — set NEXT_PUBLIC_BUILDER_CODE");
  }
}

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const targetChainId =
  Number(process.env.NEXT_PUBLIC_CHAIN_ID) || base.id;
