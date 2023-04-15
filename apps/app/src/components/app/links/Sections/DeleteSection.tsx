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

export default function DeleteSection(props: { sectionId: string }) {
  const previewContext = usePreviewContext();
  const { sectionId } = props;
  const { mutateAsync, isLoading } = api.section.delete.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(sectionId);
      previewContext?.reload();
      onClose();
      await utils.section.getWithLinks.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Tooltip hasArrow label="Delete section">
        <IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          icon={<Icon name="Delete" />}
          aria-label="Delete section"
        />
      </Tooltip>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Section?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? This action will cause permanent data loss. All the links inside this
            section will also get deleted.
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
