import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import React from "react";

export default function DeleteSection(props: { sectionId: string }) {
  const previewContext = usePreviewContext();
  const { sectionId } = props;
  const { mutateAsync, isLoading } = api.section.delete.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
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
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Delete group">
        <Chakra.IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          icon={<Icon name="Delete" />}
          aria-label="Delete group"
        />
      </Chakra.Tooltip>
      <Chakra.AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <Chakra.AlertDialogOverlay />
        <Chakra.AlertDialogContent>
          <Chakra.AlertDialogHeader>Delete Group?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss. All the links inside this group will also get
            deleted.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button isLoading={isLoading} onClick={handleClick} colorScheme="purple">
              Yes
            </Chakra.Button>
          </Chakra.AlertDialogFooter>
        </Chakra.AlertDialogContent>
      </Chakra.AlertDialog>
    </Chakra.Box>
  );
}
