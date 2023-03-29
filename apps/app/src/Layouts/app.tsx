import AppBar from "@/components/app/common/AppBar";
import { Conditional } from "@/components/common/Conditional";
import Loader from "@/components/common/Loader";
import { SEO } from "@/components/common/SEO";
import { PreviewProvider, usePreviewContext } from "@/providers/preview";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";

export function PreviewPanel() {
  const previewContext = usePreviewContext();
  if (previewContext === undefined) return <></>;

  const { ref, username, isLoading } = previewContext;

  return (
    <Chakra.VStack
      position="sticky"
      top={"96px"}
      right={0}
      h="calc(100vh - 96px)"
      w="full"
      flexGrow={3}
      maxW={{ base: "full", md: 450, xl: 500, "2xl": 550 }}
      display={{ base: "none", md: "block" }}
      overflow="hidden"
      borderLeftWidth={1}
      borderColor="purple.100"
    >
      <Conditional
        condition={!isLoading}
        component={
          <Chakra.Center w="full" h="full" p={10}>
            <iframe
              className="mx-auto h-full w-full max-w-sm rounded-3xl border-8 border-gray-900"
              src={`/${username}`}
              ref={ref}
            />
          </Chakra.Center>
        }
        fallback={<Loader />}
      />
    </Chakra.VStack>
  );
}

type AppLayoutProps = AppProps & {
  hidePreviewPanel?: boolean;
};

export function AppLayout(props: AppLayoutProps) {
  const { children, hidePreviewPanel = false } = props;
  return (
    <Chakra.Box bg="purple.50" className="h-[100vh] w-full overflow-x-hidden">
      <SEO title="App" description="The Linkify editor where your page is customized" />
      <AppBar />
      <PreviewProvider>
        <Chakra.HStack spacing={0} w="full" align="start">
          <Chakra.Stack w="full" p={3} align="center">
            {children}
          </Chakra.Stack>
          {!hidePreviewPanel && <PreviewPanel />}
        </Chakra.HStack>
      </PreviewProvider>
    </Chakra.Box>
  );
}
