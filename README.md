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
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_CHAIN_ID` | `8453` (Base mainnet) |
| `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` | Deployed `DailyCheckIn` address |
| `NEXT_PUBLIC_BASE_APP_ID` | From [base.dev](https://base.dev) |
| `NEXT_PUBLIC_BUILDER_CODE` | e.g. `bc_…` from Settings → Builder Code |

## Deploy contract

```bash
cd contracts
export PRIVATE_KEY=0x...
forge script script/Deploy.s.sol --rpc-url https://mainnet.base.org --broadcast
```

Deployed `DailyCheckIn` on Base mainnet: `0x8D54CEe63F52Eb02B07023adc41e0587bF065BA5` — set `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` in Vercel to match.

## Base.dev registration

1. Create a project at [base.dev](https://base.dev)
2. Set primary URL, name, icon (`web/public/app-icon.jpg`), thumbnail (`web/public/app-thumbnail.jpg`)
3. Add builder code and `NEXT_PUBLIC_BASE_APP_ID` to env
4. Verify `<meta name="base:app_id" />` in page source

## Gameplay

- **Level 1:** Swipe `N → E → O → N` on adjacent hex cells to spell **NEON**
- Completing a level auto-advances to the next after ~1.2s
- Progress is saved in `localStorage` (no wallet required)

## Builder Codes

Configured in [`web/lib/wagmi/config.ts`](web/lib/wagmi/config.ts) via `ox` `Attribution.toDataSuffix`. Transactions from the web app include your suffix when `NEXT_PUBLIC_BUILDER_CODE` is set.

## License

MIT
