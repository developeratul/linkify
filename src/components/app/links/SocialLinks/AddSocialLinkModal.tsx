import IconPicker from "@/components/common/IconPicker";
import { Icon } from "@/Icons";
import * as Chakra from "@chakra-ui/react";
import React from "react";

export function AddSocialLinkModal() {
  const { onOpen, isOpen, onClose } = Chakra.useDisclosure();
  const [icon, setIcon] = React.useState("");
  const closeModal = () => {
    onClose();
  };
  return (
    <Chakra.Box>
      <Chakra.Button onClick={onOpen} leftIcon={<Icon name="Add" />} colorScheme="purple">
        Add new
      </Chakra.Button>
      <Chakra.Modal scrollBehavior="inside" isOpen={isOpen} onClose={closeModal}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalCloseButton />
          <Chakra.ModalHeader>Add social link</Chakra.ModalHeader>
          <Chakra.ModalBody>
            <Chakra.HStack>
              <IconPicker
                selectedIcon={icon}
                setStateAction={setIcon}
                trigger={
                  <Chakra.IconButton
                    title="Pick an icon"
                    colorScheme="purple"
                    aria-label="Pick icon"
                    icon={<Icon name="Thumbnail" />}
                  />
                }
              />
              <Chakra.Input placeholder="Enter URL" />
            </Chakra.HStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button leftIcon={<Icon name="Add" />} w="full" colorScheme="purple">
              Add
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}
