import { poppins } from "@/fonts/profile";
import type { ProfileTheme } from "@/pages/[slug]";
import { useToken } from "@chakra-ui/react";
import type { BackgroundType, CardShadow } from "@prisma/client";

export const themes: Record<string, ProfileTheme & { name: string }> = {
  dracula: {
    name: "Dracula",
    themeColor: "#9580FF",
    foreground: "#F8F8F2",
    grayColor: "#7970A9",
    bodyBackgroundType: "COLOR",
    bodyBackgroundColor: "#22212C",
    bodyBackgroundImage: null,
    cardShadow: "none",
    font: "spaceMono",
    cardBackgroundColor: "#fefefe",
  },
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
