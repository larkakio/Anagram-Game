/** Curated English word bank by length (anagram-friendly) */
export const WORDS_BY_LENGTH: Record<number, string[]> = {
  4: [
    "CODE",
    "WAVE",
    "NEON",
    "NODE",
    "BYTE",
    "CORE",
    "DATA",
    "GRID",
    "HACK",
    "LINK",
    "MESH",
    "ROOT",
    "SYNC",
    "VOLT",
    "ZERO",
    "FLUX",
    "GLOW",
    "DISK",
    "PORT",
    "WIRE",
  ],
  5: [
    "LASER",
    "NEXUS",
    "PHASE",
    "PULSE",
    "QUERY",
    "ROBOT",
    "SPARK",
    "VAULT",
    "WIRED",
    "BLADE",
    "CHAIN",
    "DELTA",
    "ETHER",
    "FORGE",
    "GHOST",
    "HYPER",
    "IONIC",
    "PIXEL",
    "RADAR",
    "SONIC",
  ],
  6: [
    "BINARY",
    "CRYPTO",
    "FUTURE",
    "GALAXY",
    "HACKER",
    "KERNEL",
    "MATRIX",
    "NEURAL",
    "PHOTON",
    "ROUTER",
    "SIGNAL",
    "SYSTEM",
    "TENSOR",
    "VECTOR",
    "WIZARD",
    "CIRCUIT",
    "DIGITAL",
    "ORBITAL",
  ],
  7: [
    "ANDROID",
    "CORTEX",
    "DIGITAL",
    "EMERALD",
    "GATEWAY",
    "HORIZON",
    "JUNCTION",
    "NETWORK",
    "OPTICAL",
    "REACTOR",
    "SYNAPSE",
    "FIREWALL",
    "QUANTUM",
    "PROTOCOL",
  ],
};

export function pickWord(length: number, seed: number): string {
  const pool = WORDS_BY_LENGTH[length] ?? WORDS_BY_LENGTH[4];
  return pool[seed % pool.length] ?? pool[0];
}

export function buildLetterPool(
  targets: string[],
  cellCount: number,
  decoyCount: number,
  seed: number,
): string[] {
  const letters: string[] = [];
  for (const target of targets) {
    letters.push(...target.split(""));
  }

  const basePool = [...letters];
  let i = 0;
  while (letters.length < cellCount - decoyCount) {
    letters.push(basePool[i % basePool.length]);
    i++;
  }

  const decoys = "XZQJK".split("");
  let d = 0;
  while (letters.length < cellCount) {
    letters.push(decoys[(seed + d) % decoys.length]);
    d++;
  }

  for (let j = letters.length - 1; j > 0; j--) {
    const k = (seed + j * 11) % (j + 1);
    [letters[j], letters[k]] = [letters[k], letters[j]];
  }

  return letters.slice(0, cellCount);
}
