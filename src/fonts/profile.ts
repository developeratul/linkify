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
  Space_Mono,
} from "next/font/google";

export const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const robotoMono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

export const ebGaramond = EB_Garamond({
  weight: "400",
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
  weight: "400",
  subsets: ["latin"],
});

export const robotoSlab = Roboto_Slab({
  weight: "400",
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
};

export const DEFAULT_FONT_NAME = "poppins";
export const defaultFont = poppins;
