import AppBar from "@/components/app/AppBar";
import { PreviewPanel, PreviewProvider } from "@/providers/preview";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";

export type AppLayoutProps = AppProps & {
  username: string;
};

export function AppLayout(props: AppLayoutProps) {
  const { children, username } = props;
  return (
    <Chakra.Box className="h-full w-full overflow-x-hidden" bg="gray.100">
      <AppBar />
      <Chakra.HStack w="full" align="start">
        <PreviewProvider username={username}>
          <Chakra.Stack p={3} w="full" align="center">
            {children}
          </Chakra.Stack>
          <PreviewPanel />
        </PreviewProvider>
      </Chakra.HStack>
    </Chakra.Box>
  );
}
