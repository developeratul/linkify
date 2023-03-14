import { Icon } from "@/Icons";
import type { Link as LinkType } from "@/types";
import * as Chakra from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { AddThumbnail } from "./AddThumbnail";
import { EditLinkModal } from "./EditLinkModal";

export type LinkProps = {
  link: LinkType;
  index: number;
};

export function Link(props: LinkProps) {
  const { link, index } = props;
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const [purple100, purple500] = Chakra.useToken("colors", ["purple.100", "purple.500"]);
  return (
    <Draggable index={index} draggableId={link.id}>
      {(provided) => (
        <Chakra.Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          rounded={{ base: "md", md: "lg" }}
          boxShadow="base"
          p={{ base: 3, md: 5 }}
        >
          <Chakra.HStack w="full" spacing={3} justify="space-between" align="center">
            <Chakra.HStack overflow="hidden" align="center" spacing={3}>
              <AddThumbnail link={link}>
                {link.thumbnail ? (
                  <Chakra.Image
                    alt="Thumbnail"
                    rounded="md"
                    fallbackSrc="https://via.placeholder.com/50"
                    fit="cover"
                    boxSize={50}
                    cursor="pointer"
                    src={link.thumbnail}
                  />
                ) : (
                  <Chakra.Image
                    alt="No thumbnail"
                    rounded="md"
                    src={`https://via.placeholder.com/50/${purple100.replace(
                      "#",
                      ""
                    )}/${purple500.replace("#", "")}`}
                    cursor="pointer"
                    fit="cover"
                    boxSize={{ base: 10, md: 50 }}
                  />
                )}
              </AddThumbnail>
              <Chakra.Tooltip label="Edit link">
                <Chakra.VStack
                  overflow="hidden"
                  maxW="md"
                  w="full"
                  align="start"
                  cursor="pointer"
                  onClick={onOpen}
                  spacing="1"
                >
                  <Chakra.Heading
                    maxW="full"
                    noOfLines={1}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                  >
                    {link.text}
                  </Chakra.Heading>
                  <Chakra.Text maxW="full" noOfLines={1} fontSize={{ base: "xs", md: "sm" }}>
                    {link.url}
                  </Chakra.Text>
                </Chakra.VStack>
              </Chakra.Tooltip>
            </Chakra.HStack>

            <Chakra.HStack spacing={3}>
              <Chakra.Tooltip label="Clicks">
                <Chakra.HStack
                  display={{ base: "none", sm: "flex" }}
                  align="center"
                  color={link.hidden ? "gray.600" : "purple.600"}
                >
                  <Chakra.Text fontWeight="medium">{link.clickCount}</Chakra.Text>
                  <Icon name="Click" />
                </Chakra.HStack>
              </Chakra.Tooltip>
              <Chakra.Tooltip label="Drag n drop link">
                <Chakra.IconButton
                  size={{ base: "xs" }}
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
