import Loader from "@/components/common/Loader";
import type { AppProps } from "@/types";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Hide,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "components";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const previewContext = usePreviewContext();
  if (previewContext === undefined) return <></>;

  const { ref, username, isLoading } = previewContext;

  return (
    <Hide above="md">
      <Box position="fixed" bottom={5} right={5} zIndex="sticky">
        <Button size="sm" leftIcon={<Icon name="Preview" />} onClick={onOpen} colorScheme="purple">
          Preview
        </Button>
        <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Preview</DrawerHeader>
            <DrawerBody p={0}>
              {isLoading ? (
                <Loader />
              ) : (
                <Hide above="md">
                  <iframe
                    src={`/${username}`}
                    ref={ref}
                    className="mx-auto h-full w-full max-w-md"
                  />
                </Hide>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Hide>
  );
}
