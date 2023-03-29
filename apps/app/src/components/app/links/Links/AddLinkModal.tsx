import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
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
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const { formState, register, handleSubmit, reset } = useForm<AddLinkSchema>({
    resolver: zodResolver(addLinkSchema),
  });
  const { mutateAsync, isLoading } = api.link.add.useMutation();
  const utils = api.useContext();
  const toast = Chakra.useToast();

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
    <Chakra.Box w="full">
      <Chakra.Button onClick={onOpen} w="full" colorScheme="purple" leftIcon={<Icon name="Add" />} variant="outline">
        Add new link
      </Chakra.Button>
      <Chakra.Modal isOpen={isOpen} onClose={onClose}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Add link</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <Chakra.VStack as="form" id="add-link-form" onSubmit={handleSubmit(onSubmit)} w="full" spacing={5}>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.text}>
                <Chakra.FormLabel>Link text</Chakra.FormLabel>
                <Chakra.Input {...register("text")} />
                <Chakra.FormErrorMessage>{formState.errors.text?.message}</Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.url}>
                <Chakra.FormLabel>Link URL</Chakra.FormLabel>
                <Chakra.Input {...register("url")} />
                <Chakra.FormErrorMessage>{formState.errors.url?.message}</Chakra.FormErrorMessage>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              w="full"
              isLoading={isLoading}
              type="submit"
              form="add-link-form"
              colorScheme="purple"
              leftIcon={<Icon name="Add" />}
            >
              Add
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}
