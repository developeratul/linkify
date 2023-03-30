import { usePreviewContext } from "@/providers/preview";
import type { Link } from "@/types";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteLink } from "./DeleteLink";

export const editLinkSchema = z.object({
  text: z.string(),
  url: z.string().url("Invalid URL"),
  hidden: z.boolean().default(false),
});

export type EditLinkSchema = z.infer<typeof editLinkSchema>;

type EditLinkProps = {
  link: Link;
  isOpen: boolean;
  onClose: () => void;
};

export function EditLinkModal(props: EditLinkProps) {
  const previewContext = usePreviewContext();
  const { link, isOpen, onClose } = props;
  const { register, formState, handleSubmit, reset } = useForm<EditLinkSchema>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: link,
  });
  const { mutateAsync, isLoading } = api.link.edit.useMutation();
  const toast = useToast();
  const utils = api.useContext();

  const closeModal = () => {
    onClose();
    reset();
  };

  const onSubmit = async (values: EditLinkSchema) => {
    try {
      const updatedLink = await mutateAsync({ ...values, linkId: link.id });
      await utils.section.getWithLinks.invalidate();
      previewContext?.reload();
      onClose();
      reset(updatedLink);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Modal size="lg" scrollBehavior="inside" onClose={closeModal} isOpen={isOpen}>
      <Chakra.ModalOverlay />
      <Chakra.ModalContent>
        <Chakra.ModalHeader>Edit link</Chakra.ModalHeader>
        <Chakra.ModalCloseButton />
        <Chakra.ModalBody>
          <Chakra.VStack
            as="form"
            id="edit-link-form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={5}
          >
            <Chakra.FormControl isRequired isInvalid={!!formState.errors.text}>
              <Chakra.FormLabel>Text</Chakra.FormLabel>
              <Chakra.Input {...register("text")} />
              <Chakra.FormErrorMessage>{formState.errors.text?.message}</Chakra.FormErrorMessage>
            </Chakra.FormControl>
            <Chakra.FormControl isRequired isInvalid={!!formState.errors.url}>
              <Chakra.FormLabel>URL</Chakra.FormLabel>
              <Chakra.Input {...register("url")} />
              <Chakra.FormErrorMessage>{formState.errors.url?.message}</Chakra.FormErrorMessage>
            </Chakra.FormControl>
            <Chakra.HStack justify="space-between" w="full">
              <DeleteLink linkId={link.id} />
              <Chakra.Switch {...register("hidden")} colorScheme="purple" fontWeight="medium">
                Hide
              </Chakra.Switch>
            </Chakra.HStack>
          </Chakra.VStack>
        </Chakra.ModalBody>
        <Chakra.ModalFooter>
          <Chakra.Button
            w="full"
            type="submit"
            form="edit-link-form"
            colorScheme="purple"
            isLoading={isLoading}
            leftIcon={<Icon name="Save" />}
          >
            Save changes
          </Chakra.Button>
        </Chakra.ModalFooter>
      </Chakra.ModalContent>
    </Chakra.Modal>
  );
}
