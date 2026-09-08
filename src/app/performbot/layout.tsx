import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif-report",
});

export const metadata: Metadata = {
  title: "PerformBot — Protótipo",
  description: "Protótipo navegável de Performance Management AI-native para áreas comerciais",
};

export default function PerformBotRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable} h-full`}>
      <body className="h-full bg-[#fdfdfc] text-[#1a1a1a]">{children}</body>
    </html>
  );
}
