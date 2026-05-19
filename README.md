# Anagram Game — Base Standard Web App

Mobile-first cyberpunk anagram puzzle game with hex swipe controls, optional daily on-chain check-in on Base, and ERC-8021 Builder Code attribution.

## Stack

- **web/** — Next.js (App Router), TypeScript, Tailwind, wagmi + viem + TanStack Query
- **contracts/** — Foundry `DailyCheckIn` (gas-only, no `msg.value`)

## Quick start

```bash
cd web && npm install && npm run dev
```

```bash
cd contracts && forge test
```

## Environment (Vercel root: `web`)

Copy [`.env.example`](.env.example) to `web/.env.local` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://anagram-game-delta.vercel.app` |
| `NEXT_PUBLIC_CHAIN_ID` | `8453` (Base mainnet) |
| `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` | Deployed `DailyCheckIn` address |
| `NEXT_PUBLIC_BASE_APP_ID` | `6a0c0d62e2b4a22f3ba56edc` (Base dashboard) |
| `NEXT_PUBLIC_BUILDER_CODE` | `bc_aqeu7aw5` (Settings → Builder Code on [base.dev](https://base.dev)) |

## Deploy contract

```bash
cd contracts
export PRIVATE_KEY=0x...
forge script script/Deploy.s.sol --rpc-url https://mainnet.base.org --broadcast
```

Deployed `DailyCheckIn` on Base mainnet: `0x8D54CEe63F52Eb02B07023adc41e0587bF065BA5` — set `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in Vercel to match.

## Base.dev registration

1. Create a project at [base.dev](https://base.dev)
2. Primary URL: `https://anagram-game-delta.vercel.app` — icon (`web/public/app-icon.jpg`), thumbnail (`web/public/app-thumbnail.jpg`)
3. Add builder code and `NEXT_PUBLIC_BASE_APP_ID` to env
4. Verify `<meta name="base:app_id" />` in page source

## Gameplay

- **Level 1:** Swipe `N → E → O → N` on adjacent hex cells to spell **NEON**
- Completing a level auto-advances to the next after ~1.2s
- Progress is saved in `localStorage` (no wallet required)

## Builder Codes

Configured per [Builder Codes for app developers](https://docs.base.org/apps/builder-codes/app-developers): `ox` `Attribution.toDataSuffix({ codes: [NEXT_PUBLIC_BUILDER_CODE] })` on the wagmi `dataSuffix` config — all `writeContract` / send txs (including daily check-in) are attributed automatically.

## License

MIT
