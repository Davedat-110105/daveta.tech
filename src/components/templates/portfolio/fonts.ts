import { Dancing_Script, Inter, Instrument_Serif } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
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
