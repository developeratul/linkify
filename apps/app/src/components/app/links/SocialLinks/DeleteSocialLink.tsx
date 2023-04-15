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
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import React from "react";

export function DeleteSocialLink(props: { socialLinkId: string }) {
  const { socialLinkId } = props;
  const previewContext = usePreviewContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const { isLoading, mutateAsync } = api.socialLink.delete.useMutation();
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(socialLinkId);
      previewContext?.reload();
      onClose();
      await utils.socialLink.get.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Tooltip hasArrow label="Delete social link">
        <IconButton
          size={{ base: "sm", sm: "md" }}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          aria-label="Delete social link"
          icon={<Icon name="Delete" />}
        />
      </Tooltip>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Social Link?</AlertDialogHeader>
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
