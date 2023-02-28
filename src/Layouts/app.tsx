import AppBar from "@/components/app/common/AppBar";
import { SEO } from "@/components/common/SEO";
import { PreviewPanel, PreviewProvider } from "@/providers/preview";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";

export function AppLayout(props: AppProps) {
  const { children } = props;
  return (
    <Chakra.Box className="h-full w-full overflow-x-hidden" bg="purple.50">
      <SEO
        title="App"
        description="The Linkify editor where your page is customized"
      />
      <AppBar />
      <Chakra.HStack w="full" align="start">
        <PreviewProvider>
          <Chakra.Stack p={3} w="full" align="center">
            {children}
          </Chakra.Stack>
          <PreviewPanel />
        </PreviewProvider>
      </Chakra.HStack>
    </Chakra.Box>
  );
}
