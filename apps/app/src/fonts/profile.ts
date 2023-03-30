import type { NextFont } from "next/dist/compiled/@next/font";
import {
  DM_Sans,
  EB_Garamond,
  Inter,
  Open_Sans,
  Poppins,
  Quicksand,
  Roboto_Mono,
  Roboto_Slab,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

export const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const robotoMono = Roboto_Mono({
  weight: "variable",
  subsets: ["latin"],
});

export const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
});

export const ebGaramond = EB_Garamond({
  weight: "variable",
  subsets: ["latin"],
});

export const dmSans = DM_Sans({
  weight: "400",
  subsets: ["latin"],
});

export const quicksand = Quicksand({
  weight: "500",
  subsets: ["latin"],
});

export const openSans = Open_Sans({
  weight: "variable",
  subsets: ["latin"],
});

export const robotoSlab = Roboto_Slab({
  weight: "variable",
  subsets: ["latin"],
});

export const spaceGrotesk = Space_Grotesk({
  weight: "variable",
  subsets: ["latin"],
});

export const fonts: Record<string, NextFont> = {
  robotoMono,
  spaceMono,
  poppins,
  inter,
  ebGaramond,
  dmSans,
  quicksand,
  openSans,
  robotoSlab,
  spaceGrotesk,
};

export const DEFAULT_FONT_NAME = "spaceGrotesk";
export const defaultFont = spaceGrotesk;
