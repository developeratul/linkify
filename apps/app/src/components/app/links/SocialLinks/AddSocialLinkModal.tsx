import IconPicker from "@/components/app/common/IconPicker";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon, TablerIcon } from "components";
import React from "react";
import { z } from "zod";

export function AddSocialLinkModal() {
  const { onOpen, isOpen, onClose } = useDisclosure();
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
    <Box>
      <Button onClick={onOpen} leftIcon={<Icon name="Add" />} colorScheme="purple">
        Add new
      </Button>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Add social link</ModalHeader>
          <ModalBody>
            <HStack>
              <IconPicker
                selectedIcon={iconName}
                setStateAction={setIconName}
                trigger={
                  <IconButton
                    title="Pick an icon"
                    colorScheme="purple"
                    aria-label="Pick icon"
                    icon={iconName ? <TablerIcon name={iconName} /> : <Icon name="Thumbnail" />}
                  />
                }
              />
              <form onSubmit={handleSubmit} id="add-social-icon" className="w-full">
                <FormControl isInvalid={!!inputError}>
                  <Input
                    placeholder="Enter URL"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    type="url"
                  />
                  <FormErrorMessage>{inputError}</FormErrorMessage>
                </FormControl>
              </form>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              leftIcon={<Icon name="Add" />}
              w="full"
              colorScheme="purple"
              type="submit"
              form="add-social-icon"
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
