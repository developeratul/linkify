import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import React from "react";

export function DeleteLink(props: { linkId: string }) {
  const previewContext = usePreviewContext();
  const { linkId } = props;
  const { mutateAsync, isLoading } = api.link.delete.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(linkId);
      onClose();
      await utils.section.getWithLinks.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Button onClick={onOpen} leftIcon={<Icon name="Delete" />} variant="ghost" colorScheme="red">
        Delete
      </Button>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete link?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button isLoading={isLoading} onClick={handleClick} colorScheme="purple">
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
