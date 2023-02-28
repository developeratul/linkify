import Loader from "@/components/common/Loader";
import { Icon } from "@/Icons";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

export type PreviewContextState = {
  ref: React.MutableRefObject<HTMLIFrameElement | null>;
  reload: () => void;
  username: string;
  isLoading: boolean;
};

export const PreviewContext = React.createContext<PreviewContextState | undefined>(undefined);

export type PreviewProviderProps = AppProps;

export function PreviewProvider(props: PreviewProviderProps) {
  const { children } = props;
  const previewRef = React.useRef<HTMLIFrameElement | null>(null);
  const { data, status } = useSession();

  const reloadPreview = () => {
    const iframe = previewRef.current;

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.location.reload();
    }
  };

  const values: PreviewContextState = {
    ref: previewRef,
    reload: reloadPreview,
    username: data?.user?.username as string,
    isLoading: status === "loading",
  };

  return (
    <PreviewContext.Provider value={values}>
      <PreviewDrawer />
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreviewContext = () => React.useContext(PreviewContext);

export function PreviewDrawer() {
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();

  const previewContext = usePreviewContext();
  if (previewContext === undefined) return <></>;

  const { ref, username, isLoading } = previewContext;

  return (
    <Chakra.Box display={{ sm: "block", md: "none" }} position="fixed" bottom={5} right={5} zIndex="sticky">
      <Chakra.Button size="sm" leftIcon={<Icon name="Preview" />} onClick={onOpen} colorScheme="purple">
        Preview
      </Chakra.Button>
      <Chakra.Drawer isOpen={isOpen} onClose={onClose} placement="left" size="full">
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerHeader>Preview</Chakra.DrawerHeader>
          <Chakra.DrawerBody p={1}>
            {isLoading ? (
              <Loader />
            ) : (
              <iframe src={`/${username}`} ref={ref} className="mx-auto h-full w-full max-w-md rounded-md" />
            )}
          </Chakra.DrawerBody>
        </Chakra.DrawerContent>
      </Chakra.Drawer>
    </Chakra.Box>
  );
}

export function PreviewPanel() {
  const previewContext = usePreviewContext();
  if (previewContext === undefined) return <></>;

  const { ref, username, isLoading } = previewContext;

  return (
    <Chakra.VStack
      position="sticky"
      top={"96px"}
      right={0}
      w="full"
      h="calc(100vh - 96px)"
      maxW={{ base: "full", md: 350, lg: 450, xl: 500, "2xl": 550 }}
      display={{ base: "none", md: "block" }}
      rounded="md"
      overflow="hidden"
      bg="purple.200"
    >
      {isLoading ? <Loader /> : <iframe className="h-full w-full" src={`/${username}`} ref={ref} />}
    </Chakra.VStack>
  );
}
