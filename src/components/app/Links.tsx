import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import uploadFile from "@/utils/uploadFile";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { AxiosError } from "axios";
import type { ChangeEvent } from "react";
import React from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type Link = {
  id: string;
  thumbnail?: string | null;
  text: string;
  url: string;
};

export function DeleteLink(props: { linkId: string }) {
  const { linkId } = props;
  const { mutateAsync, isLoading } = api.link.delete.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(linkId);
      onClose();
      await utils.group.getWithLinks.invalidate();
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

export const addThumbnailSchema = z.object({
  url: z.string().url("Invalid URL"),
  publicId: z.string().optional(),
});

export function AddThumbnail(props: { link: Link }) {
  const {
    link: { id: linkId, thumbnail },
  } = props;
  const { mutateAsync } = api.link.addThumbnail.useMutation();
  const [isLoading, setLoading] = React.useState(false);
  const [hasThumbnail, setHasThumbnail] = React.useState(!!thumbnail);
  const [file, setFile] = React.useState<Blob | string | null>();
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const toast = useToast();
  const utils = api.useContext();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (file instanceof Blob) {
        const { secure_url, public_id } = await uploadFile(file);
        await mutateAsync({ linkId, publicId: public_id, url: secure_url });
      } else if (typeof file === "string") {
        await mutateAsync({ linkId, url: file });
      }

      await utils.group.getWithLinks.invalidate();
      onClose();
      setFile(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          status: "error",
          description: err.response?.data.message || err.message,
        });
      } else if (err instanceof TRPCClientError) {
        console.log({ err });
        toast({
          status: "error",
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setHasThumbnail(!!thumbnail);
  }, [thumbnail]);

  return (
    <Chakra.Popover onOpen={onOpen} isOpen={isOpen} onClose={onClose}>
      <Chakra.PopoverTrigger>
        <Chakra.IconButton
          colorScheme="purple"
          icon={Icons.Icons}
          aria-label="Add Link thumbnail"
        />
      </Chakra.PopoverTrigger>
      <Chakra.PopoverContent>
        <Chakra.PopoverArrow />
        <Chakra.PopoverCloseButton />
        <Chakra.PopoverHeader>Add thumbnail</Chakra.PopoverHeader>
        <Chakra.PopoverBody>
          <Chakra.VStack
            as="form"
            onSubmit={handleSubmit}
            id="add-thumbnail-form"
          >
            <Chakra.FormControl>
              <Chakra.FormLabel>Enter public URL</Chakra.FormLabel>
              <Chakra.Input size="sm" onChange={handleUrlInputChange} />
            </Chakra.FormControl>
            <Chakra.Text py={1} fontWeight="medium">
              or
            </Chakra.Text>
            <Chakra.FormControl>
              <Chakra.FormLabel>Upload File</Chakra.FormLabel>
              <Chakra.Input
                onChange={handleFileInputChange}
                size="sm"
                type="file"
                accept="image/jpeg, image/png, image/gif, image/svg+xml"
              />
            </Chakra.FormControl>
          </Chakra.VStack>
        </Chakra.PopoverBody>
        <Chakra.PopoverFooter>
          <Chakra.Button size="sm" mr={3} onClick={onClose}>
            Cancel
          </Chakra.Button>
          <Chakra.Button
            size="sm"
            colorScheme="purple"
            type="submit"
            form="add-thumbnail-form"
            isLoading={isLoading}
          >
            Save
          </Chakra.Button>
        </Chakra.PopoverFooter>
      </Chakra.PopoverContent>
    </Chakra.Popover>
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
                <AddThumbnail link={link} />
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
  const { mutateAsync } = api.link.reorder.useMutation();
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
        await utils.group.getWithLinks.invalidate();
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
            {provided.placeholder}
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
  const { mutateAsync, isLoading } = api.link.create.useMutation();
  const utils = api.useContext();
  const toast = Chakra.useToast();

  const onSubmit = async (values: CreateLinkSchema) => {
    try {
      await mutateAsync({ ...values, groupId });
      await utils.group.getWithLinks.invalidate();
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
