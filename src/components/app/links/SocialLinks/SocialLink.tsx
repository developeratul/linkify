import { Icon, SocialIcon } from "@/Icons";
import type { SocialLink as SocialLinkType } from "@/types";
import * as Chakra from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { DeleteSocialLink } from "./DeleteSocialLink";

export function SocialLink(props: { socialLink: SocialLinkType; index: number }) {
  const { socialLink, index } = props;
  return (
    <Draggable draggableId={socialLink.id} index={index}>
      {(provided) => (
        <Chakra.HStack
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
          <Chakra.Flex gap={1} w="full" overflow="hidden" align="center">
            <Chakra.IconButton
              {...provided.dragHandleProps}
              size={{ base: "xs", sm: "sm" }}
              icon={<Icon name="Drag" />}
              colorScheme="purple"
              variant="ghost"
              aria-label="Drag and drop social link"
              flexShrink={0}
            />
            <Chakra.HStack align="center" overflow="hidden" spacing={5}>
              <Chakra.Text
                flex={1}
                fontSize={{ base: "sm", md: "md" }}
                noOfLines={2}
                fontWeight="medium"
              >
                {socialLink.url}
              </Chakra.Text>
              <Chakra.Box color="purple.500">
                <SocialIcon name={socialLink.icon} />
              </Chakra.Box>
            </Chakra.HStack>
          </Chakra.Flex>
          <Chakra.Flex>
            <DeleteSocialLink socialLinkId={socialLink.id} />
          </Chakra.Flex>
        </Chakra.HStack>
      )}
    </Draggable>
  );
}
