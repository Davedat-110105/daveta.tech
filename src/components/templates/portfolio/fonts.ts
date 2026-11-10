import { Dancing_Script, Newsreader, Source_Sans_3 } from "next/font/google";

export const sourceSans = Source_Sans_3({
  variable: "--font-portfolio-sans",
  subsets: ["latin"],
  display: "swap",
});

export const newsreader = Newsreader({
  variable: "--font-portfolio-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// The loading screen writes a cursive "hello", the way a new Mac or iPhone
// greets you out of the box. A script face, not the display serif.
export const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
