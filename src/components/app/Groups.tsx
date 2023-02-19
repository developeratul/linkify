import { SectionLoader } from "@/components/common/Loader";
import { EmptyMessage, ErrorMessage } from "@/components/common/Message";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import SectionWrapper from "../common/SectionWrapper";
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
          variant="ghost"
          icon={<Icon name="Delete" />}
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

export type GroupProps = {
  group: Group;
  index: number;
};

export function Group(props: GroupProps) {
  const { group, index } = props;
  const [name, setName] = React.useState(group.name || "Untitled");
  const { mutateAsync } = api.group.edit.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const handleUpdateName: Chakra.UseEditableProps["onSubmit"] = async (
    value
  ) => {
    if (name === "") setName("Untitled");
    await mutateAsync({ groupId: group.id, name: value });
    await utils.group.getWithLinks.invalidate();
    previewContext?.reload();
  };
  return (
    <Draggable draggableId={group.id} index={index}>
      {(provided) => (
        <Chakra.VStack
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          spacing={5}
          borderWidth={1}
          borderColor="purple.300"
          bg="purple.100"
          p={{ base: 3, md: 5 }}
          rounded="md"
        >
          <Chakra.HStack justify="space-between" align="center" w="full">
            <Chakra.HStack align="center">
              <Chakra.Tooltip hasArrow label="Drag n drop group">
                <Chakra.IconButton
                  {...provided.dragHandleProps}
                  cursor="inherit"
                  colorScheme="purple"
                  variant="ghost"
                  aria-label="Drag group"
                  icon={<Icon name="Drag" />}
                  size="sm"
                />
              </Chakra.Tooltip>
              <Chakra.Editable
                onSubmit={handleUpdateName}
                value={name}
                onChange={(value) => setName(value)}
              >
                <Chakra.EditablePreview
                  as={Chakra.Text}
                  fontSize="lg"
                  noOfLines={1}
                  color="purple.600"
                  fontWeight="medium"
                />
                <Chakra.EditableInput
                  fontWeight="medium"
                  fontSize="lg"
                  color="purple.600"
                />
              </Chakra.Editable>
            </Chakra.HStack>
            <Chakra.HStack align="center" spacing={3}>
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
        description="Groups are sections which will contain and display your links."
        createButton={<CreateGroupModal />}
      />
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SectionWrapper title="Groups" cta={<CreateGroupModal />}>
        <Droppable droppableId="group-droppable">
          {(provided) => (
            <Chakra.VStack
              {...provided.droppableProps}
              ref={provided.innerRef}
              w="full"
              spacing="4"
            >
              {data.map((group, index) => (
                <Group group={group} index={index} key={group.id} />
              ))}
              {provided.placeholder}
            </Chakra.VStack>
          )}
        </Droppable>
      </SectionWrapper>
    </DragDropContext>
  );
}

export function CreateGroupModal() {
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
      leftIcon={<Icon name="Create" />}
    >
      Create new
    </Chakra.Button>
  );
}
