import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnChainGM | Your Daily Web3 Ritual - Send GM Across 100+ Blockchains",
  description:
    "Send your daily GM on-chain across 100+ blockchains. Join thousands of Web3 enthusiasts in the ultimate crypto ritual. Connect your wallet and start your Web3 journey today.",
  keywords: [
    "Web3",
    "blockchain",
    "crypto",
    "GM",
    "good morning",
    "on-chain",
    "daily ritual",
    "multi-chain",
    "cryptocurrency",
    "DeFi",
    "Web3 community",
  ],
  icons: {
    icon: "https://onchaingm.com/favicon.ico",
  },
  openGraph: {
    title: "OnChainGM | Your Daily Web3 Ritual",
    description: "Join thousands of Web3 enthusiasts in sending your daily GM across multiple blockchains.",
    url: "https://onchaingm.com",
    siteName: "OnChainGM",
    images: [
      {
        url: "https://onchaingm.com/social-card.png",
        width: 1080,
        height: 1080,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[#d4ff3f]/25 selection:text-[#d4ff3f]">
        <Web3Provider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
