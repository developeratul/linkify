import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type Link = {
  id: string;
  icon?: string | null;
  text: string;
  url: string;
};

export function DeleteLink(props: { linkId: string }) {
  const { linkId } = props;
  const { mutateAsync, isLoading } = api.app.deleteLink.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(linkId);
      onClose();
      await utils.app.getGroupsWithLinks.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Tooltip label="Delete link" hasArrow>
        <Chakra.IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          icon={Icons.Delete}
          aria-label="Delete link"
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
          <Chakra.AlertDialogHeader>Delete link?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              onClick={handleClick}
              colorScheme="purple"
            >
              Yes
            </Chakra.Button>
          </Chakra.AlertDialogFooter>
        </Chakra.AlertDialogContent>
      </Chakra.AlertDialog>
    </Chakra.Box>
  );
}

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
  const { mutateAsync, isLoading } = api.app.editLink.useMutation();
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
      await utils.app.getGroupsWithLinks.invalidate();
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

export type LinkProps = {
  link: Link;
  index: number;
};

export function Link(props: LinkProps) {
  const { link, index } = props;
  return (
    <Draggable index={index} draggableId={link.id}>
      {(provided) => (
        <Chakra.Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          size="lg"
        >
          <Chakra.CardBody>
            <Chakra.VStack w="full" align="start">
              <Chakra.Text fontSize="lg" fontWeight="medium">
                {link.text}
              </Chakra.Text>
              <Chakra.Text>{link.url}</Chakra.Text>
            </Chakra.VStack>
          </Chakra.CardBody>
          <Chakra.CardFooter pt={0}>
            <Chakra.HStack w="full" justifyContent="space-between">
              <Chakra.HStack>
                <Chakra.IconButton
                  colorScheme="purple"
                  icon={Icons.Icons}
                  aria-label="Link icon"
                />
                <Chakra.Tooltip label="Drag n drop link">
                  <Chakra.IconButton
                    {...provided.dragHandleProps}
                    icon={Icons.Drag}
                    aria-label="Drag link"
                  />
                </Chakra.Tooltip>
              </Chakra.HStack>
              <Chakra.HStack spacing={3}>
                <EditLink link={link} />
                <DeleteLink linkId={link.id} />
              </Chakra.HStack>
            </Chakra.HStack>
          </Chakra.CardFooter>
        </Chakra.Card>
      )}
    </Draggable>
  );
}

export type LinksProps = {
  links: Link[];
};

export default function Links(props: LinksProps) {
  const { links } = props;
  const { mutateAsync } = api.app.reorderLinks.useMutation();
  const utils = api.useContext();
  const toast = useToast();

  const handleDragEnd: OnDragEndResponder = async (result) => {
    try {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const items = links;
      const item = items?.find((link) => link.id === draggableId);
      if (item) {
        items?.splice(source.index, 1);
        items?.splice(destination.index, 0, item);

        await mutateAsync({
          newOrder: items?.map((item) => item.id) as string[],
        });
        await utils.app.getGroupsWithLinks.invalidate();
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="link-droppable">
        {(provided) => (
          <Chakra.VStack
            {...provided.droppableProps}
            ref={provided.innerRef}
            w="full"
            spacing={3}
          >
            {links.map((link, index) => (
              <Link link={link} key={link.id} index={index} />
            ))}
          </Chakra.VStack>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export const createLinkSchema = z.object({
  text: z.string().min(1, "Link text is required"),
  url: z.string().url("Invalid URL"),
});

export type CreateLinkSchema = z.infer<typeof createLinkSchema>;

export function CreateLinkModal(props: { groupId: string }) {
  const { groupId } = props;
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const { formState, register, handleSubmit, reset } =
    useForm<CreateLinkSchema>({
      resolver: zodResolver(createLinkSchema),
    });
  const { mutateAsync, isLoading } = api.app.createLink.useMutation();
  const utils = api.useContext();
  const toast = Chakra.useToast();

  const onSubmit = async (values: CreateLinkSchema) => {
    try {
      await mutateAsync({ ...values, groupId });
      await utils.app.getGroupsWithLinks.invalidate();
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
      <Chakra.Button
        onClick={onOpen}
        w="full"
        colorScheme="blue"
        leftIcon={Icons.Add}
      >
        Add new link
      </Chakra.Button>
      <Chakra.Modal isOpen={isOpen} onClose={onClose}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Add link</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <Chakra.VStack
              as="form"
              id="add-link-form"
              onSubmit={handleSubmit(onSubmit)}
              w="full"
              spacing={5}
            >
              <Chakra.FormControl
                isRequired
                isInvalid={!!formState.errors.text}
              >
                <Chakra.FormLabel>Link text</Chakra.FormLabel>
                <Chakra.Input {...register("text")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.text?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.url}>
                <Chakra.FormLabel>Link URL</Chakra.FormLabel>
                <Chakra.Input {...register("url")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.url?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button onClick={onClose} mr={3}>
              cancel
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              type="submit"
              form="add-link-form"
              colorScheme="purple"
              leftIcon={Icons.Add}
            >
              Add
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}
