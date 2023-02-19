import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import React from "react";

export function DeleteLink(props: { linkId: string }) {
  const previewContext = usePreviewContext();
  const { linkId } = props;
  const { mutateAsync, isLoading } = api.link.delete.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(linkId);
      onClose();
      await utils.group.getWithLinks.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Button
        onClick={onOpen}
        leftIcon={<Icon name="Delete" />}
        variant="ghost"
        colorScheme="red"
      >
        Delete
      </Chakra.Button>
      <Chakra.AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <Chakra.AlertDialogOverlay />
        <Chakra.AlertDialogContent>
          <Chakra.AlertDialogHeader>Delete link?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              onClick={handleClick}
              colorScheme="purple"
            >
              Yes
            </Chakra.Button>
          </Chakra.AlertDialogFooter>
        </Chakra.AlertDialogContent>
      </Chakra.AlertDialog>
    </Chakra.Box>
  );
}
