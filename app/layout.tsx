import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seasonal Gardening Basics — Jade Belstead | Kingston, NY",
  description: "Learn to plant and nurture your own herbs and vegetables. Free community gardening workshops every Saturday in October hosted by Jade Belstead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBF9] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
