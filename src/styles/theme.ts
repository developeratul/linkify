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
      50: "#F4F3F6",
      100: "#E8E8EE",
      200: "#CCCBD8",
      300: "#ACAAC0",
      400: "#7F7C9D",
      500: "#22212C",
      600: "#191820",
      700: "#191820",
      800: "#191820",
      900: "#000000",
    },
    purple: {
      50: "#F7F5FF",
      100: "#EEEBFF",
      200: "#D9D1FF",
      300: "#BFB3FF",
      400: "#A28FFF",
      500: "#7559FF",
      600: "#6647FF",
      700: "#512EFF",
      800: "#2900F5",
      900: "#1F00BD",
    },
  },
});
