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
  title: "Jade Workshop | Ateliers Céramique & Grès à Paris",
  description: "Réservez votre atelier artisanal de tournage, modelage et émaillage à Paris avec Jade. Réservation simple et instantanée en 3 clics.",
  keywords: ["céramique", "poterie", "atelier paris", "tournage", "modelage", "artisanat", "jade workshop"],
  openGraph: {
    title: "Jade Workshop | Ateliers Céramique & Grès à Paris",
    description: "Réservez votre atelier artisanal de tournage, modelage et émaillage en 3 clics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm-50 text-charcoal">{children}</body>
    </html>
  );
}
