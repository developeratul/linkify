import { Icon } from "@/Icons";
import { socialIcons } from "@/Icons/Social";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialLink } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SectionLoader } from "../common/Loader";
import { ErrorMessage } from "../common/Message";

export function SocialLink(props: { socialLink: SocialLink; index: number }) {
  const { socialLink, index } = props;
  return (
    <Draggable draggableId={socialLink.id} index={index}>
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
          <Chakra.Heading {...provided.dragHandleProps}>
            {socialLink.url}
          </Chakra.Heading>
        </Chakra.VStack>
      )}
    </Draggable>
  );
}

export function SocialLinks() {
  const { isLoading, isError, error, data } = api.sociaLink.get.useQuery();

  const handleDragEnd = async () => {
    //
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;
  if (!data?.length) return <></>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Chakra.VStack gap={5} w="full" align="start">
        <Chakra.VStack w="full" align="start">
          <Chakra.Heading size="md" color="purple.500" fontWeight="medium">
            Social links
          </Chakra.Heading>
          <CreateSocialLink />
        </Chakra.VStack>
        <Droppable droppableId="social-link-droppable">
          {(provided) => (
            <Chakra.VStack
              {...provided.droppableProps}
              ref={provided.innerRef}
              w="full"
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
      </Chakra.VStack>
    </DragDropContext>
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
    "other",
  ]),
});

export type AddSocialLinkSchema = z.infer<typeof addSocialLinkSchema>;

export function CreateSocialLink() {
  const form = useForm<AddSocialLinkSchema>({
    resolver: zodResolver(addSocialLinkSchema),
  });
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const { isLoading, mutateAsync } = api.sociaLink.create.useMutation();
  const toast = useToast();
  const utils = api.useContext();
  const closeModal = () => {
    onClose();
    form.reset();
  };
  const handleSubmit = async (values: AddSocialLinkSchema) => {
    try {
      await mutateAsync(values);
      closeModal();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };
  return (
    <Chakra.Box w="full">
      <Chakra.Button
        onClick={onOpen}
        w="full"
        leftIcon={<Icon name="Add" />}
        colorScheme="purple"
      >
        Add social link
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
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </Chakra.Select>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button onClick={closeModal} mr={3}>
              Cancel
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              colorScheme="purple"
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
