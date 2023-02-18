import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    serif: "EB Garamond",
    "sans-serif": "Noto Sans",
    monospace: "Space Mono",
    cursive: "Caveat",
    fantasy: "fantasy",
  },
  colors: {
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
