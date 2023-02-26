import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    serif: "EB Garamond",
    "sans-serif": "Poppins",
    monospace: "Space Mono",
    cursive: "Caveat",
    body: "Poppins",
  },
  colors: {
    purple: {
      "50": "#f8f6fe",
      "100": "#e5dcfb",
      "200": "#cdbdf8",
      "300": "#b197f5",
      "400": "#a181f2",
      "500": "#8a62ef",
      "600": "#7452cd",
      "700": "#5e42a4",
      "800": "#4f388b",
      "900": "#392864",
    },
  },
});
