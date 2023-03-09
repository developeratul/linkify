import { robotoMono, spaceMono } from "@/fonts";
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: spaceMono.style.fontFamily,
    body: robotoMono.style.fontFamily,
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
  components: {
    Button: {
      baseStyle: {
        fontWeight: 500,
      },
    },
    Text: {
      baseStyle: {
        fontWeight: "normal",
      },
    },
  },
});
