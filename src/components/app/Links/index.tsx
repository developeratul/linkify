import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AddThumbnail } from "./AddThumbnail";
import { DeleteLink } from "./DeleteLink";
import { EditLink } from "./EditLink";

export type Link = {
  id: string;
  thumbnail?: string | null;
  text: string;
  url: string;
};

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
          size={{ base: "md", md: "lg" }}
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
                    icon={<Icon name="Drag" />}
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
