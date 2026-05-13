import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/cursor/CustomCursor";
import Copyright from "../components/portfolio/footer/Copyright";
import {
  PageTransitionProvider,
  PageTransitionOverlay,
} from "@/components/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Sai Kiran's Portfolio - Full Stack Developer",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        {/* Custom cursor above content */}
        <CustomCursor />
        <PageTransitionProvider expansionDuration={800}>
          <div className="relative z-10 min-h-dvh">{children}</div>
          {/* Page transition overlay for cursor expansion effect */}
          <PageTransitionOverlay />
        </PageTransitionProvider>
        {/* Copyright fetched client-side to avoid blocking SSR */}
        <Copyright />
      </body>
    </html>
  );
}

