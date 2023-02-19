import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AddThumbnail } from "./AddThumbnail";
import { EditLinkModal } from "./EditLinkModal";

export type Link = {
  id: string;
  thumbnail?: string | null;
  text: string;
  url: string;
  clickCount: number;
  hidden: boolean;
};

export type LinkProps = {
  link: Link;
  index: number;
};

export function Link(props: LinkProps) {
  const { link, index } = props;
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  return (
    <Draggable index={index} draggableId={link.id}>
      {(provided) => (
        <Chakra.Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          rounded="lg"
          boxShadow="base"
          p={5}
        >
          <Chakra.HStack spacing={3} justify="space-between" align="center">
            <Chakra.HStack
              w="full"
              align="center"
              justify="stretch"
              spacing={3}
            >
              <AddThumbnail link={link}>
                {link.thumbnail ? (
                  <Chakra.Image
                    rounded="md"
                    fallbackSrc="https://via.placeholder.com/50"
                    fit="cover"
                    boxSize={50}
                    src={link.thumbnail}
                  />
                ) : (
                  <Chakra.Image
                    rounded="md"
                    src={`https://via.placeholder.com/50/EEEBFF/6647FF`}
                    fit="cover"
                    boxSize={50}
                  />
                )}
              </AddThumbnail>
              <Chakra.Tooltip label="Edit link">
                <Chakra.VStack
                  align="start"
                  w="full"
                  cursor="pointer"
                  onClick={onOpen}
                  spacing="1"
                >
                  <Chakra.Heading noOfLines={1} size="sm" fontWeight="medium">
                    {link.text}
                  </Chakra.Heading>
                  <Chakra.Text noOfLines={1} fontSize="sm">
                    {link.url}
                  </Chakra.Text>
                </Chakra.VStack>
              </Chakra.Tooltip>
            </Chakra.HStack>
            <Chakra.HStack spacing="3" pr={3}>
              <Chakra.Tooltip label="Clicks">
                <Chakra.HStack
                  align="center"
                  color={link.hidden ? "gray.600" : "purple.600"}
                >
                  <Icon name="Click" />
                  <Chakra.Text fontWeight="medium">
                    {link.clickCount}
                  </Chakra.Text>
                </Chakra.HStack>
              </Chakra.Tooltip>
              <Chakra.Tooltip label="Drag n drop link">
                <Chakra.IconButton
                  variant="ghost"
                  colorScheme="purple"
                  {...provided.dragHandleProps}
                  icon={<Icon name="Drag" />}
                  aria-label="Drag link"
                />
              </Chakra.Tooltip>
            </Chakra.HStack>
          </Chakra.HStack>
          <EditLinkModal link={link} isOpen={isOpen} onClose={onClose} />
        </Chakra.Box>
      )}
    </Draggable>
  );
}

export type LinksProps = {
  links: Link[];
};

export default function Links(props: LinksProps) {
  const previewContext = usePreviewContext();
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
        previewContext?.reload();
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
