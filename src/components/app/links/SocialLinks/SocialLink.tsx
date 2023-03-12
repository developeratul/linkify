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
        <Chakra.Flex
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          bg="white"
          p={{ base: 2, sm: 4 }}
          rounded="xl"
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
              <Chakra.Heading size={{ base: "sm" }} noOfLines={1} fontWeight="medium">
                {socialLink.url}
              </Chakra.Heading>
              <Chakra.Box color="purple.500">
                <SocialIcon name={socialLink.icon} />
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
