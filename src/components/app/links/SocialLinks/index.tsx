import { SectionLoader } from "@/components/common/Loader";
import { EmptyMessage, ErrorMessage } from "@/components/common/Message";
import SectionWrapper from "@/components/common/SectionWrapper";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { AddSocialLinkModal } from "./AddSocialLinkModal";
import { SocialLink } from "./SocialLink";

export function SocialLinks() {
  const { isLoading, isError, error, data } = api.socialLink.get.useQuery();
  const { mutateAsync } = api.socialLink.reorder.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const toast = useToast();

  const handleDragEnd: OnDragEndResponder = async (result) => {
    try {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;

      const items = data;
      const item = items?.find((socialLink) => socialLink.id === draggableId);

      if (item) {
        items?.splice(source.index, 1);
        items?.splice(destination.index, 0, item);

        await mutateAsync({
          newOrder: items?.map((item) => item.id) as string[],
        });
        await utils.socialLink.get.invalidate();
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
        title="No Social Links"
        description="You have no social links created. Click the button below to create one."
        createButton={<AddSocialLinkModal />}
      />
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SectionWrapper title="Social links" cta={<AddSocialLinkModal />}>
        <Droppable droppableId="social-link-droppable">
          {(provided) => (
            <Chakra.VStack {...provided.droppableProps} ref={provided.innerRef} w="full" spacing="2">
              {data.map((socialLink, index) => (
                <SocialLink key={socialLink.id} index={index} socialLink={socialLink} />
              ))}
              {provided.placeholder}
            </Chakra.VStack>
          )}
        </Droppable>
      </SectionWrapper>
    </DragDropContext>
  );
}
