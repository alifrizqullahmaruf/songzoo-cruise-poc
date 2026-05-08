import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PhoneShell } from "@/components/PhoneShell";
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
  title: "SongZoo Cruise",
  description: "Turn your cruise into your song.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SongZoo Cruise",
  },
};

export const viewport: Viewport = {
  themeColor: "#3F69B0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <PhoneShell>{children}</PhoneShell>
      </body>
    </html>
  );
}
