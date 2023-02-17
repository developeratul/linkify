import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    serif: "EB Garamond",
    "sans-serif": "Noto Sans",
    monospace: "Jetbrains Mono",
    cursive: "Caveat",
    fantasy: "fantasy",
  },
  colors: {
    gray: {
      50: "#F9FAFB",
      100: "#EFF2F6",
      200: "#DFE4EC",
      300: "#CFD7E3",
      400: "#C2CCDB",
      500: "#B1BED1",
      600: "#8296B5",
      700: "#556D90",
      800: "#394960",
      900: "#1C2430",
    },
  },
});
