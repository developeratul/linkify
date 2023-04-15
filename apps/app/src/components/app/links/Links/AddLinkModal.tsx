import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const addLinkSchema = z.object({
  text: z.string().min(1, "Link text is required"),
  url: z.string().url("Invalid URL"),
});

export type AddLinkSchema = z.infer<typeof addLinkSchema>;

export function AddLinkModal(props: { sectionId: string }) {
  const previewContext = usePreviewContext();
  const { sectionId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { formState, register, handleSubmit, reset } = useForm<AddLinkSchema>({
    resolver: zodResolver(addLinkSchema),
  });
  const { mutateAsync, isLoading } = api.link.add.useMutation();
  const utils = api.useContext();
  const toast = useToast();

  const onSubmit = async (values: AddLinkSchema) => {
    try {
      await mutateAsync({ ...values, sectionId });
      await utils.section.getWithLinks.invalidate();
      previewContext?.reload();
      onClose();
      reset();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({
          status: "error",
          title: "Application Error",
          description: err.message,
        });
      }
    }
  };

  return (
    <Box w="full">
      <Button
        onClick={onOpen}
        w="full"
        colorScheme="purple"
        leftIcon={<Icon name="Add" />}
        variant="outline"
      >
        Add new link
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              as="form"
              id="add-link-form"
              onSubmit={handleSubmit(onSubmit)}
              w="full"
              spacing={5}
            >
              <FormControl isRequired isInvalid={!!formState.errors.text}>
                <FormLabel>Link text</FormLabel>
                <Input {...register("text")} />
                <FormErrorMessage>{formState.errors.text?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!formState.errors.url}>
                <FormLabel>Link URL</FormLabel>
                <Input {...register("url")} />
                <FormErrorMessage>{formState.errors.url?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              isLoading={isLoading}
              type="submit"
              form="add-link-form"
              colorScheme="purple"
              leftIcon={<Icon name="Add" />}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
