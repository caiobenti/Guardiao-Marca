import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Guardião da Marca",
  description: "Plataforma de gestão de marca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="h-full flex">
        <Sidebar />
        <main className="flex-1 min-h-full overflow-auto bg-[#f9f9f7]">
          {children}
        </main>
      </body>
    </html>
  );
}
