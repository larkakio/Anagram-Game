import type { Metadata, Viewport } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import { WagmiProvider } from "@/components/providers/WagmiProvider";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anagram-game-delta.vercel.app";

const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID ?? "6a0c0d62e2b4a22f3ba56edc";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Anagram Game | Synapse Vault",
  description:
    "Swipe neon hex letters to crack anagram ciphers. Mobile cyberpunk word game on Base.",
  manifest: "/manifest.json",
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
  other: {
    "base:app_id": baseAppId,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00fff0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTech.variable} h-full`}
    >
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body className="scanlines min-h-dvh overflow-x-hidden font-sans text-[var(--foreground)] antialiased">
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}
