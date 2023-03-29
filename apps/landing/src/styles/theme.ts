import { extendTheme } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import customTheme from "theme";

const spaceGrotesk = Space_Grotesk({
  weight: "variable",
  subsets: ["latin"],
});

export const theme = extendTheme({
  fonts: {
    body: spaceGrotesk.style.fontFamily,
    heading: spaceGrotesk.style.fontFamily,
  },
  ...customTheme,
});
