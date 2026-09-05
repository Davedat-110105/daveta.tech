import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Archivo, Geist, IBM_Plex_Mono } from "next/font/google";
import { SkipLink } from "@/components/SkipLink";
import { jsonLd, site, siteUrl } from "@/lib/site";
import "./globals.css";

// Archivo carries the display voice: a grotesk with enough width and weight
// range to hold poster scale without the editorial-serif reflex.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name}, ${site.role.toLowerCase()}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: "Dave",
    lastName: "Ta",
    siteName: site.name,
    title: `${site.name}, ${site.role.toLowerCase()}`,
    description: site.description,
    url: siteUrl,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role.toLowerCase()}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <noscript>
          {/* Scroll reveals are progressive enhancement — without scripts the
              content must simply be there. */}
          <style>{`[data-reveal],.name-reveal,.blur-in{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Server-rendered so crawlers and AI agents see it in the initial
          // HTML; JSON.stringify output is escaped for the closing-tag case.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
