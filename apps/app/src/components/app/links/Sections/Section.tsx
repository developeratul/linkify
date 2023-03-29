import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import type { Section } from "@/types";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
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
  const handleUpdateName: Chakra.UseEditableProps["onSubmit"] = async (value) => {
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
        <Chakra.VStack
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
          <Chakra.HStack justify="space-between" align="center" w="full">
            <Chakra.HStack align="center">
              <Chakra.Tooltip hasArrow label="Drag n drop section">
                <Chakra.IconButton
                  {...provided.dragHandleProps}
                  cursor="inherit"
                  colorScheme="purple"
                  variant="ghost"
                  aria-label="Drag section"
                  icon={<Icon name="Drag" />}
                  size="sm"
                />
              </Chakra.Tooltip>
              <Chakra.Editable
                onSubmit={handleUpdateName}
                value={name}
                onChange={(value) => setName(value)}
              >
                <Chakra.EditablePreview
                  as={Chakra.Text}
                  fontSize="lg"
                  noOfLines={1}
                  color="purple.600"
                  fontWeight="medium"
                />
                <Chakra.EditableInput fontWeight="medium" fontSize="lg" color="purple.600" />
              </Chakra.Editable>
            </Chakra.HStack>
            <Chakra.HStack align="center" spacing={3}>
              <DeleteSection sectionId={section.id} />
            </Chakra.HStack>
          </Chakra.HStack>
          <Chakra.VStack w="full" spacing={5}>
            <Links links={section.links} />
            <AddLinkModal sectionId={section.id} />
          </Chakra.VStack>
        </Chakra.VStack>
      )}
    </Draggable>
  );
}
