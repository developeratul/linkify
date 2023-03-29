import { poppins } from "@/fonts/profile";
import { useToken } from "@chakra-ui/react";
import type { BackgroundType, CardShadow } from "@prisma/client";

export type Theme = {
  name: string;
  themeColor: string;
  foreground: string;
  grayColor: string;
  bodyBackgroundType: BackgroundType;
  bodyBackgroundColor?: string | null;
  bodyBackgroundImage?: string | null;
  cardShadow: CardShadow;
  font: string;
  cardBackgroundColor: string;
};

export const themes: Record<string, Theme> = {
  dracula: {
    name: "Dracula",
    themeColor: "#9580FF",
    foreground: "#F8F8F2",
    grayColor: "#7970A9",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#22212C",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "quicksand",
    cardBackgroundColor: "#151320",
  },
  night_owl: {
    name: "Night Owl",
    themeColor: "#C792EA",
    foreground: "#D6DEEB",
    grayColor: "#637777",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#011627",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "openSans",
    cardBackgroundColor: "#01121F",
  },
  shades_of_purple: {
    name: "Shades of purple",
    themeColor: "#FAD000",
    foreground: "#A599E9",
    grayColor: "#B362FF",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#2D2B55",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "poppins",
    cardBackgroundColor: "#1E1E3F",
  },
  mirage: {
    name: "Mirage",
    themeColor: "#FFAD66",
    foreground: "#CCCAC2",
    grayColor: "#B8CFE6",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#1F2430",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "inter",
    cardBackgroundColor: "#1A1F29",
  },
  cobalt: {
    name: "Cobalt",
    themeColor: "#FF9D00",
    foreground: "#FFFFFF",
    grayColor: "#0088FF",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#193549",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "robotoMono",
    cardBackgroundColor: "#1F4662",
  },
  tokyo: {
    name: "Tokyo Night",
    themeColor: "#7DCFFF",
    foreground: "#C0CAF5",
    grayColor: "#444B6A",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#1A1B26",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "poppins",
    cardBackgroundColor: "#16161E",
  },
  winter: {
    name: "Winter is coming",
    themeColor: "#00BFF9",
    foreground: "#D6DEEB",
    grayColor: "#999999",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#011627",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "spaceMono",
    cardBackgroundColor: "#072E5B",
  },
  synthwave: {
    name: "SynthWave",
    themeColor: "#FF7EDB",
    foreground: "#BBBBBB",
    grayColor: "#848BBD",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#262335",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "dmSans",
    cardBackgroundColor: "#241B2F",
  },
  bluloco: {
    name: "Bluloco",
    themeColor: "#D52753",
    foreground: "#383A42",
    grayColor: "#A0A1A7",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#F9F9F9",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "poppins",
    cardBackgroundColor: "#FFFFFF",
  },
  theme_2077: {
    name: "2077",
    themeColor: "#FF2E97",
    foreground: "#FFD400",
    grayColor: "#0098DF",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#030D22",
    bodyBackgroundImage: null,
    cardShadow: "md",
    font: "spaceMono",
    cardBackgroundColor: "#030D22",
  },
};

export const getRawTheme = (theme: Theme) => {
  const { name, ...rawTheme } = theme;
  return rawTheme;
};

export const useDefaultProfileTheme = () => {
  const [purple50, purple100, purple500, gray300, gray600] = useToken("colors", [
    "purple.50",
    "purple.100",
    "purple.500",
    "gray.300",
    "gray.600",
  ]);

  return {
    bodyBackgroundColor: purple50,
    cardBackgroundColor: purple100,
    themeColor: purple500,
    grayColor: gray300,
    foreground: gray600,
    bodyBackgroundImage: null,
    bodyBackgroundType: "COLOR" as BackgroundType,
    cardShadow: "none" as CardShadow,
    font: poppins,
  };
};
