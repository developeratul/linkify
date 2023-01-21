import { SectionLoader } from "@/components/common/Loader";
import { EmptyMessage, ErrorMessage } from "@/components/common/Message";
import { Icons } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
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
import type { Link } from "./Links";
import Links from "./Links";
import { CreateLinkModal } from "./Links/CreateLink";

export type Group = {
  id: string;
  name?: string | null;
  links: Link[];
};

export function DeleteGroup(props: { groupId: string }) {
  const previewContext = usePreviewContext();
  const { groupId } = props;
  const { mutateAsync, isLoading } = api.group.delete.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(groupId);
      previewContext?.reload();
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
      <Chakra.Tooltip hasArrow label="Delete group">
        <Chakra.IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          icon={Icons.Delete}
          aria-label="Delete group"
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
          <Chakra.AlertDialogHeader>Delete Group?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss. All the
            links inside this group will also get deleted.
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

export const editGroupSchema = z.object({
  name: z.string().nullable(),
});

export type EditGroupSchema = z.infer<typeof editGroupSchema>;

export function EditGroup(props: { group: Group }) {
  const previewContext = usePreviewContext();
  const { group } = props;
  const { register, formState, handleSubmit, reset } = useForm<EditGroupSchema>(
    {
      resolver: zodResolver(editGroupSchema),
      defaultValues: group,
    }
  );
  const { mutateAsync, isLoading } = api.group.edit.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const closeDrawer = () => {
    onClose();
    reset();
  };

  const onSubmit = async (values: EditGroupSchema) => {
    try {
      const updatedGroup = await mutateAsync({ ...values, groupId: group.id });
      await utils.group.getWithLinks.invalidate();
      previewContext?.reload();
      onClose();
      reset(updatedGroup);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Edit group">
        <Chakra.IconButton
          isLoading={isLoading}
          ref={btnRef}
          onClick={onOpen}
          colorScheme="blue"
          aria-label="Edit Group"
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
          <Chakra.DrawerHeader>Edit group</Chakra.DrawerHeader>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerBody>
            <Chakra.VStack
              as="form"
              id="edit-group-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Chakra.FormControl isInvalid={!!formState.errors.name}>
                <Chakra.FormLabel>Name</Chakra.FormLabel>
                <Chakra.Input {...register("name")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.name?.message}
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
              form="edit-group-form"
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

export type GroupProps = {
  group: Group;
  index: number;
};

export function Group(props: GroupProps) {
  const { group, index } = props;
  return (
    <Draggable draggableId={group.id} index={index}>
      {(provided) => (
        <Chakra.VStack
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          spacing={5}
          borderWidth={2}
          borderStyle="dashed"
          borderColor="gray.300"
          bg="gray.100"
          p={{ base: 3, md: 5 }}
          rounded="md"
        >
          <Chakra.HStack justify="space-between" align="center" w="full">
            <Chakra.HStack align="center">
              <Chakra.Tooltip hasArrow label="Drag n drop group">
                <Chakra.IconButton
                  {...provided.dragHandleProps}
                  cursor="inherit"
                  aria-label="Drag group"
                  icon={Icons.Drag}
                  size="sm"
                />
              </Chakra.Tooltip>
              <Chakra.Heading size="md" fontWeight="medium">
                {group.name || "Untitled"}
              </Chakra.Heading>
            </Chakra.HStack>
            <Chakra.HStack align="center" spacing={3}>
              <EditGroup group={group} />
              <DeleteGroup groupId={group.id} />
            </Chakra.HStack>
          </Chakra.HStack>
          <Chakra.VStack w="full" spacing={5}>
            <Links links={group.links} />
            <CreateLinkModal groupId={group.id} />
          </Chakra.VStack>
        </Chakra.VStack>
      )}
    </Draggable>
  );
}

export default function Groups() {
  const previewContext = usePreviewContext();
  const { data, isLoading, isError, error } = api.group.getWithLinks.useQuery();
  const { mutateAsync } = api.group.reorder.useMutation();
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

      const items = data;
      const item = items?.find((group) => group.id === draggableId);
      if (item) {
        items?.splice(source.index, 1);
        items?.splice(destination.index, 0, item);

        await mutateAsync({
          newOrder: items?.map((item) => item.id) as string[],
        });
        await utils.group.getWithLinks.invalidate();
        previewContext?.reload();
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;
  if (!data?.length)
    return (
      <EmptyMessage
        title="No groups created"
        description="Groups are sections where your links will be shown. Start by creating a group."
      />
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="group-droppable">
        {(provided) => (
          <Chakra.VStack
            {...provided.droppableProps}
            ref={provided.innerRef}
            w="full"
          >
            {data.map((group, index) => (
              <Group group={group} index={index} key={group.id} />
            ))}
            {provided.placeholder}
          </Chakra.VStack>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function CreateGroup() {
  const previewContext = usePreviewContext();
  const { isLoading, mutateAsync } = api.group.create.useMutation();
  const utils = api.useContext();

  const handleClick = async () => {
    await mutateAsync();
    await utils.group.getWithLinks.invalidate();
    previewContext?.reload();
  };
  return (
    <Chakra.Button
      isLoading={isLoading}
      onClick={handleClick}
      colorScheme="purple"
      w="full"
      leftIcon={Icons.Create}
    >
      Create new group
    </Chakra.Button>
  );
}
