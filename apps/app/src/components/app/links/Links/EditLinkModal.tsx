import { usePreviewContext } from "@/providers/preview";
import type { Link } from "@/types";
import { api } from "@/utils/api";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  VStack,
  useToast,
} from "@chakra-ui/react";
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
    <Modal size="lg" scrollBehavior="inside" onClose={closeModal} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack as="form" id="edit-link-form" onSubmit={handleSubmit(onSubmit)} spacing={5}>
            <FormControl isRequired isInvalid={!!formState.errors.text}>
              <FormLabel>Text</FormLabel>
              <Input {...register("text")} />
              <FormErrorMessage>{formState.errors.text?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!formState.errors.url}>
              <FormLabel>URL</FormLabel>
              <Input {...register("url")} />
              <FormErrorMessage>{formState.errors.url?.message}</FormErrorMessage>
            </FormControl>
            <HStack justify="space-between" w="full">
              <DeleteLink linkId={link.id} />
              <Switch {...register("hidden")} colorScheme="purple" fontWeight="medium">
                Hide
              </Switch>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            w="full"
            type="submit"
            form="edit-link-form"
            colorScheme="purple"
            isLoading={isLoading}
            leftIcon={<Icon name="Save" />}
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
