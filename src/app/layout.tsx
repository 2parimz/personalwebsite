import type { Metadata } from "next";
import { Bodoni_Moda, Caveat, Inter } from "next/font/google";
import "./globals.css";

import { site } from "@/content/site";
import { EasterEggs } from "@/components/eggs/EasterEggs";
import { CustomCursor } from "@/components/CustomCursor";

/** High-contrast Didone for headlines — the fashion-masthead voice. */
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});

/** Quiet grotesque for everything that has to be read rather than admired. */
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});

/** Used in exactly one place: the annotations on the flat-lay spread. */
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: `${site.role}. ${site.issue}, ${site.season}.`,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: `${site.role}. ${site.issue}, ${site.season}.`,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="day"
      className={`${display.variable} ${sans.variable} ${hand.variable}`}
    >
      <body>
        <EasterEggs>
          <CustomCursor />
          <main>{children}</main>
        </EasterEggs>
      </body>
    </html>
  );
}
