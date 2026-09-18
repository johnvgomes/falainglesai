import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakAI — Prática de Inglês por Voz com IA | por John Victor Gomes",
  description:
    "Plataforma gratuita de conversação em inglês com inteligência artificial adaptativa. Desenvolvido por John Victor Gomes com Clean Architecture, .NET 9 e React.",
  keywords: [
    "SpeakAI",
    "Inglês com IA",
    "Conversação em inglês",
    "Clean Architecture",
    ".NET 9",
    "React",
    "John Victor Gomes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-zinc-100 min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}