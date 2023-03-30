import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import React from "react";

export function DeleteSocialLink(props: { socialLinkId: string }) {
  const { socialLinkId } = props;
  const previewContext = usePreviewContext();
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
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
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Delete social link">
        <Chakra.IconButton
          size={{ base: "sm", sm: "md" }}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          aria-label="Delete social link"
          icon={<Icon name="Delete" />}
        />
      </Chakra.Tooltip>
      <Chakra.AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <Chakra.AlertDialogOverlay />
        <Chakra.AlertDialogContent>
          <Chakra.AlertDialogHeader>Delete Social Link?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
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
