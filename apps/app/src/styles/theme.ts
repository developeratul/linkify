import { inter } from "@/fonts/profile";
import { extendTheme } from "@chakra-ui/react";
import customTheme from "theme";

export const theme = extendTheme({
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  ...customTheme,
});
