import { spaceGrotesk } from "@/fonts";
import { extendTheme } from "@chakra-ui/react";
import customTheme from "theme";

export const theme = extendTheme({
  fonts: {
    heading: spaceGrotesk.style.fontFamily,
    body: spaceGrotesk.style.fontFamily,
  },
  ...customTheme,
});
