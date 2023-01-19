import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Link } from ".";

export const editLinkSchema = z.object({
  text: z.string(),
  url: z.string().url("Invalid URL"),
});

export type EditLinkSchema = z.infer<typeof editLinkSchema>;

export function EditLink(props: { link: Link }) {
  const { link } = props;
  const { register, formState, handleSubmit, reset } = useForm<EditLinkSchema>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: link,
  });
  const { mutateAsync, isLoading } = api.link.edit.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const closeDrawer = () => {
    onClose();
    reset();
  };

  const onSubmit = async (values: EditLinkSchema) => {
    try {
      const updatedLink = await mutateAsync({ ...values, linkId: link.id });
      await utils.group.getWithLinks.invalidate();
      onClose();
      reset(updatedLink);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Edit link">
        <Chakra.IconButton
          isLoading={isLoading}
          ref={btnRef}
          onClick={onOpen}
          colorScheme="blue"
          aria-label="Edit Link"
          icon={Icons.Edit}
        />
      </Chakra.Tooltip>
      <Chakra.Drawer
        size="md"
        placement="right"
        finalFocusRef={btnRef}
        onClose={closeDrawer}
        isOpen={isOpen}
      >
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerHeader>Edit link</Chakra.DrawerHeader>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerBody>
            <Chakra.VStack
              as="form"
              id="edit-link-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={5}
            >
              <Chakra.FormControl
                isRequired
                isInvalid={!!formState.errors.text}
              >
                <Chakra.FormLabel>Text</Chakra.FormLabel>
                <Chakra.Input {...register("text")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.text?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.url}>
                <Chakra.FormLabel>URL</Chakra.FormLabel>
                <Chakra.Input {...register("url")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.url?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.DrawerBody>
          <Chakra.DrawerFooter>
            <Chakra.Button mr={3} onClick={closeDrawer}>
              Cancel
            </Chakra.Button>
            <Chakra.Button
              type="submit"
              form="edit-link-form"
              colorScheme="purple"
              isLoading={isLoading}
              leftIcon={Icons.Save}
            >
              Save changes
            </Chakra.Button>
          </Chakra.DrawerFooter>
        </Chakra.DrawerContent>
      </Chakra.Drawer>
    </Chakra.Box>
  );
}
