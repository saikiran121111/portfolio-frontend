import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import Navigation from "@/components/portfolio/navigation/Navigation";
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

const themeInitializationScript = `
  try {
    var theme = localStorage.getItem("portfolio-color-theme") === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#F2E8D5" : "#090909");
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
