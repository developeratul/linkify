import type { Link as LinkType } from "@/types";
import {
  Box,
  HStack,
  Heading,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "components";
import { Draggable } from "react-beautiful-dnd";
import { AddThumbnail } from "./AddThumbnail";
import { EditLinkModal } from "./EditLinkModal";

export type LinkProps = {
  link: LinkType;
  index: number;
};

export function Link(props: LinkProps) {
  const { link, index } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [purple100, purple500] = useToken("colors", ["purple.100", "purple.500"]);
  return (
    <Draggable index={index} draggableId={link.id}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          rounded={{ base: "md", md: "lg" }}
          boxShadow="base"
          p={{ base: 3, md: 5 }}
        >
          <HStack w="full" spacing={3} justify="space-between" align="center">
            <HStack overflow="hidden" align="center" spacing={3}>
              <AddThumbnail link={link}>
                {link.thumbnail ? (
                  <Image
                    alt="Thumbnail"
                    rounded="md"
                    fallbackSrc="https://placehold.co/50x50"
                    fit="cover"
                    boxSize={50}
                    cursor="pointer"
                    src={link.thumbnail}
                  />
                ) : (
                  <Image
                    alt="No thumbnail"
                    rounded="md"
                    src={`https://placehold.co/50x50/${purple100.replace(
                      "#",
                      ""
                    )}/${purple500.replace("#", "")}`}
                    cursor="pointer"
                    fit="cover"
                    boxSize={{ base: 10, md: 50 }}
                  />
                )}
              </AddThumbnail>
              <Tooltip label="Edit link">
                <VStack
                  overflow="hidden"
                  maxW="md"
                  w="full"
                  align="start"
                  cursor="pointer"
                  onClick={onOpen}
                  spacing="1"
                >
                  <Heading
                    maxW="full"
                    noOfLines={1}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                  >
                    {link.text}
                  </Heading>
                  <Text maxW="full" noOfLines={1} fontSize={{ base: "xs", md: "sm" }}>
                    {link.url}
                  </Text>
                </VStack>
              </Tooltip>
            </HStack>

            <HStack spacing={3}>
              <Tooltip label="Drag n drop link">
                <IconButton
                  size={{ base: "xs" }}
                  variant="ghost"
                  colorScheme="purple"
                  {...provided.dragHandleProps}
                  icon={<Icon name="Drag" />}
                  aria-label="Drag link"
                />
              </Tooltip>
            </HStack>
          </HStack>
          <EditLinkModal link={link} isOpen={isOpen} onClose={onClose} />
        </Box>
      )}
    </Draggable>
  );
}
