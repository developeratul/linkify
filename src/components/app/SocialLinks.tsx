import { Icon } from "@/Icons";
import { SocialIcon, socialIcons } from "@/Icons/Social";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialLink } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SectionLoader } from "../common/Loader";
import { EmptyMessage, ErrorMessage } from "../common/Message";
import SectionWrapper from "../common/SectionWrapper";

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
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

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
            <Chakra.VStack
              {...provided.droppableProps}
              ref={provided.innerRef}
              w="full"
              spacing="2"
            >
              {data.map((socialLink, index) => (
                <SocialLink
                  key={socialLink.id}
                  index={index}
                  socialLink={socialLink}
                />
              ))}
              {provided.placeholder}
            </Chakra.VStack>
          )}
        </Droppable>
      </SectionWrapper>
    </DragDropContext>
  );
}

export function SocialLink(props: { socialLink: SocialLink; index: number }) {
  const { socialLink, index } = props;
  return (
    <Draggable draggableId={socialLink.id} index={index}>
      {(provided) => (
        <Chakra.Flex
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          p={{ base: 2, sm: 4 }}
          rounded="md"
          shadow="base"
          justify="space-between"
          align="center"
        >
          <Chakra.Flex gap={3} align="center">
            <Chakra.IconButton
              {...provided.dragHandleProps}
              size={{ base: "xs", sm: "sm" }}
              icon={<Icon name="Drag" />}
              colorScheme="purple"
              variant="ghost"
              aria-label="Drag and drop social link"
            />
            <Chakra.HStack align="center" spacing={3}>
              <Chakra.Heading
                size={{ base: "sm" }}
                noOfLines={1}
                fontWeight="medium"
              >
                {socialLink.url}
              </Chakra.Heading>
              <Chakra.Box color="purple.500">
                <SocialIcon name={socialLink.type} size={20} />
              </Chakra.Box>
            </Chakra.HStack>
          </Chakra.Flex>
          <Chakra.Flex>
            <DeleteSocialLink socialLinkId={socialLink.id} />
          </Chakra.Flex>
        </Chakra.Flex>
      )}
    </Draggable>
  );
}

export const addSocialLinkSchema = z.object({
  url: z.string().url("Invalid URL"),
  type: z.enum([
    "facebook",
    "instagram",
    "github",
    "twitter",
    "linkedIn",
    "youTube",
    "pinterest",
    "twitch",
    "whatsapp",
    "email",
    "patreon",
    "payment",
    "signal",
    "discord",
    "spotify",
    "medium",
    "google_play",
    "figma",
    "other",
  ]),
});

export type AddSocialLinkSchema = z.infer<typeof addSocialLinkSchema>;

export function AddSocialLinkModal() {
  const form = useForm<AddSocialLinkSchema>({
    resolver: zodResolver(addSocialLinkSchema),
  });
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const { isLoading, mutateAsync } = api.socialLink.add.useMutation();
  const toast = useToast();
  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const closeModal = () => {
    onClose();
    form.reset();
  };
  const handleSubmit = async (values: AddSocialLinkSchema) => {
    try {
      await mutateAsync(values);
      await utils.socialLink.get.invalidate();
      previewContext?.reload();
      closeModal();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };
  return (
    <Chakra.Box>
      <Chakra.Button
        onClick={onOpen}
        leftIcon={<Icon name="Add" />}
        colorScheme="purple"
      >
        Add new
      </Chakra.Button>
      <Chakra.Modal isOpen={isOpen} onClose={closeModal}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalCloseButton />
          <Chakra.ModalHeader>Add social link</Chakra.ModalHeader>
          <Chakra.ModalBody>
            <Chakra.VStack
              as="form"
              id="add-social-link"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <Chakra.FormControl
                isRequired
                isInvalid={!!form.formState.errors.url}
              >
                <Chakra.FormLabel>URL</Chakra.FormLabel>
                <Chakra.Input {...form.register("url")} />
                <Chakra.FormErrorMessage>
                  {form.formState.errors.url?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl
                isInvalid={!!form.formState.errors.type}
                isRequired
              >
                <Chakra.FormLabel>Type</Chakra.FormLabel>
                <Chakra.Select placeholder="Select" {...form.register("type")}>
                  {Object.keys(socialIcons).map((key) => (
                    <option value={key} key={key}>
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </Chakra.Select>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              isLoading={isLoading}
              colorScheme="purple"
              w="full"
              leftIcon={<Icon name="Add" />}
              type="submit"
              form="add-social-link"
            >
              Add
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}

export function DeleteSocialLink(props: { socialLinkId: string }) {
  const { socialLinkId } = props;
  const previewContext = usePreviewContext();
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const { isLoading, mutateAsync } = api.socialLink.delete.useMutation();
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(socialLinkId);
      previewContext?.reload();
      onClose();
      await utils.socialLink.get.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Delete social link">
        <Chakra.IconButton
          size={{ base: "sm", sm: "md" }}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          aria-label="Delete social link"
          icon={<Icon name="Delete" />}
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
          <Chakra.AlertDialogHeader>
            Delete Social Link?
          </Chakra.AlertDialogHeader>
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
