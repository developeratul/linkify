import { spaceGrotesk } from "@/fonts";
import { ChakraProviderProps, extendTheme } from "@chakra-ui/react";
import customTheme from "theme";

export const theme = extendTheme({
  fonts: {
    heading: spaceGrotesk.style.fontFamily,
    body: spaceGrotesk.style.fontFamily,
  },
  ...customTheme,
});

export const toastOptions: ChakraProviderProps["toastOptions"] = {
  defaultOptions: {
    position: "top",
    isClosable: true,
  },
};
