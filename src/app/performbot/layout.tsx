import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="h-full bg-[#f4f5f7] text-[#1a1d29]">{children}</body>
    </html>
  );
}
