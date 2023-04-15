import type { SocialLink as SocialLinkType } from "@/types";
import { Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { Icon, TablerIcon } from "components";
import { Draggable } from "react-beautiful-dnd";
import { DeleteSocialLink } from "./DeleteSocialLink";

export function SocialLink(props: { socialLink: SocialLinkType; index: number }) {
  const { socialLink, index } = props;
  return (
    <Draggable draggableId={socialLink.id} index={index}>
      {(provided) => (
        <HStack
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          p={{ base: 3, md: 5 }}
          rounded={{ base: "md", md: "xl" }}
          shadow="base"
          justify="space-between"
          align="center"
        >
          <Flex gap={1} w="full" overflow="hidden" align="center">
            <IconButton
              {...provided.dragHandleProps}
              size={{ base: "xs", sm: "sm" }}
              icon={<Icon name="Drag" />}
              colorScheme="purple"
              variant="ghost"
              aria-label="Drag and drop social link"
              flexShrink={0}
            />
            <HStack align="center" overflow="hidden" spacing={5}>
              <Text flex={1} fontSize={{ base: "sm", md: "md" }} noOfLines={2} fontWeight="medium">
                {socialLink.url}
              </Text>
              <Box color="purple.500">
                <TablerIcon name={socialLink.icon} />
              </Box>
            </HStack>
          </Flex>
          <Flex>
            <DeleteSocialLink socialLinkId={socialLink.id} />
          </Flex>
        </HStack>
      )}
    </Draggable>
  );
}
