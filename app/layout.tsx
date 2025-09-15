import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sansita_Swashed } from "next/font/google";
import { Toaster } from "react-hot-toast";

const sansita = Sansita_Swashed({
  weight: ["400", "700"],
  subsets: ["latin"],
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XpresDeals",
    icons: {
    icon: "/favicon.ico",
  },
  description: "Discover halal food promotions across Long Island. XpresDeals helps you find local deals from halal restaurants, groceries, and butchers — updated weekly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${sansita.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
