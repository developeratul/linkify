import { usePreviewContext } from "@/providers/preview";
import type { Link as LinkType } from "@/types";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Link } from "./Link";

export type LinksProps = {
  links: LinkType[];
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
      if (destination.droppableId === source.droppableId && destination.index === source.index)
        return;

      const items = links;
      const item = items?.find((link) => link.id === draggableId);
      if (item) {
        items?.splice(source.index, 1);
        items?.splice(destination.index, 0, item);

        await mutateAsync({
          newOrder: items?.map((item) => item.id) as string[],
        });
        await utils.section.getWithLinks.invalidate();
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
          <Chakra.VStack {...provided.droppableProps} ref={provided.innerRef} w="full" spacing={3}>
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
