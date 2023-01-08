import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";

export function RootLayout(props: AppProps) {
  const { children } = props;
  return (
    <Chakra.Box className="h-[100vh] w-full overflow-x-hidden">
      {children}
    </Chakra.Box>
  );
}
