import { Icon } from "@/Icons";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import React from "react";

export type PreviewContextState = {
  ref: React.MutableRefObject<HTMLIFrameElement | null>;
  reload: () => void;
};

export const PreviewContext = React.createContext<
  PreviewContextState | undefined
>(undefined);

export type PreviewProviderProps = AppProps;

export function PreviewProvider(props: PreviewProviderProps) {
  const { children } = props;
  const previewRef = React.useRef<HTMLIFrameElement | null>(null);
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();

  const reloadPreview = () => {
    const iframe = previewRef.current;

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.location.reload();
    }
  };

  const values: PreviewContextState = {
    ref: previewRef,
    reload: reloadPreview,
  };

  return (
    <PreviewContext.Provider value={values}>
      <Chakra.Box
        display={{ sm: "block", md: "none" }}
        position="fixed"
        bottom={5}
        right={5}
        zIndex="sticky"
      >
        <Chakra.Button
          size="sm"
          leftIcon={<Icon name="Preview" />}
          onClick={onOpen}
          colorScheme="purple"
        >
          Preview
        </Chakra.Button>
        <Chakra.Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement="left"
          size="full"
        >
          <Chakra.DrawerOverlay />
          <Chakra.DrawerContent>
            <Chakra.DrawerCloseButton />
            <Chakra.DrawerHeader>Preview</Chakra.DrawerHeader>
            <Chakra.DrawerBody p={1}>
              <iframe
                src="/developeratul"
                ref={previewRef}
                className="mx-auto h-full w-full max-w-md rounded-md"
              />
            </Chakra.DrawerBody>
          </Chakra.DrawerContent>
        </Chakra.Drawer>
      </Chakra.Box>
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreviewContext = () => React.useContext(PreviewContext);
