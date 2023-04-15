import { usePreviewContext } from "@/providers/preview";
import type { Section } from "@/types";
import { api } from "@/utils/api";
import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Text,
  Tooltip,
  UseEditableProps,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "components";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Links from "../Links";
import { AddLinkModal } from "../Links/AddLinkModal";
import DeleteSection from "./DeleteSection";

export type SectionProps = {
  section: Section;
  index: number;
};

export default function Section(props: SectionProps) {
  const { section, index } = props;
  const [name, setName] = React.useState(section.name || "Untitled");
  const { mutateAsync } = api.section.edit.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const handleUpdateName: UseEditableProps["onSubmit"] = async (value) => {
    try {
      if (name === "") setName("Untitled");
      if (name === "Untitled") return;
      await mutateAsync({ sectionId: section.id, name: value });
      await utils.section.getWithLinks.invalidate();
      previewContext?.reload();
    } catch (err) {
      //
    }
  };
  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided) => (
        <VStack
          ref={provided.innerRef}
          {...provided.draggableProps}
          w="full"
          spacing={5}
          borderWidth={1}
          borderColor="purple.300"
          bg="purple.100"
          p={{ base: 3, md: 5 }}
          rounded="md"
        >
          <HStack justify="space-between" align="center" w="full">
            <HStack align="center">
              <Tooltip hasArrow label="Drag n drop section">
                <IconButton
                  {...provided.dragHandleProps}
                  cursor="inherit"
                  colorScheme="purple"
                  variant="ghost"
                  aria-label="Drag section"
                  icon={<Icon name="Drag" />}
                  size="sm"
                />
              </Tooltip>
              <Editable
                onSubmit={handleUpdateName}
                value={name}
                onChange={(value) => setName(value)}
              >
                <EditablePreview
                  as={Text}
                  fontSize="lg"
                  noOfLines={1}
                  color="purple.600"
                  fontWeight="medium"
                />
                <EditableInput fontWeight="medium" fontSize="lg" color="purple.600" />
              </Editable>
            </HStack>
            <HStack align="center" spacing={3}>
              <DeleteSection sectionId={section.id} />
            </HStack>
          </HStack>
          <VStack w="full" spacing={5}>
            <Links links={section.links} />
            <AddLinkModal sectionId={section.id} />
          </VStack>
        </VStack>
      )}
    </Draggable>
  );
}
