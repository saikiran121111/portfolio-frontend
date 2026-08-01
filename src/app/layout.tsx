import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navigation from "@/components/portfolio/navigation/Navigation";
import Copyright from "@/components/portfolio/footer/Copyright";
import { siteContent } from "@/content/site";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.metadata.baseUrl),
  title: {
    default: siteContent.metadata.title,
    template: `%s | ${siteContent.identity.shortName}`,
  },
  description: siteContent.metadata.description,
  authors: [{ name: siteContent.identity.fullName }],
  openGraph: {
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    type: "website",
    locale: "en_IN",
    siteName: `${siteContent.identity.shortName} Portfolio`,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navigation />
        {children}
        <Copyright />
      </body>
    </html>
  );
}
