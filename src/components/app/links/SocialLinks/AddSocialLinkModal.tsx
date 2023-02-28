import IconPicker from "@/components/common/IconPicker";
import { Icon, SocialIcon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { z } from "zod";

export function AddSocialLinkModal() {
  const { onOpen, isOpen, onClose } = Chakra.useDisclosure();
  const [iconName, setIconName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [inputError, setInputError] = React.useState("");
  const { mutateAsync, isLoading } = api.socialLink.add.useMutation();
  const utils = api.useContext();
  const toast = useToast();
  const previewContext = usePreviewContext();
  const closeModal = () => {
    onClose();
    setUrl("");
    setIconName("");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !iconName) return;

    if (!z.string().url().safeParse(url).success) {
      return setInputError("Invalid URL");
    }

    try {
      await mutateAsync({ url, icon: iconName });
      await utils.socialLink.get.invalidate();
      previewContext?.reload();
      closeModal();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };
  return (
    <Chakra.Box>
      <Chakra.Button onClick={onOpen} leftIcon={<Icon name="Add" />} colorScheme="purple">
        Add new
      </Chakra.Button>
      <Chakra.Modal scrollBehavior="inside" isOpen={isOpen} onClose={closeModal}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalCloseButton />
          <Chakra.ModalHeader>Add social link</Chakra.ModalHeader>
          <Chakra.ModalBody>
            <Chakra.HStack>
              <IconPicker
                selectedIcon={iconName}
                setStateAction={setIconName}
                trigger={
                  <Chakra.IconButton
                    title="Pick an icon"
                    colorScheme="purple"
                    aria-label="Pick icon"
                    icon={iconName ? <SocialIcon name={iconName} /> : <Icon name="Thumbnail" />}
                  />
                }
              />
              <form onSubmit={handleSubmit} id="add-social-icon" className="w-full">
                <Chakra.FormControl isInvalid={!!inputError}>
                  <Chakra.Input
                    placeholder="Enter URL"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    type="url"
                  />
                  <Chakra.FormErrorMessage>{inputError}</Chakra.FormErrorMessage>
                </Chakra.FormControl>
              </form>
            </Chakra.HStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              isLoading={isLoading}
              leftIcon={<Icon name="Add" />}
              w="full"
              colorScheme="purple"
              type="submit"
              form="add-social-icon"
            >
              Add
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}
