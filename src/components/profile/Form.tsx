import { useProfileContext } from "@/providers/profile";
import { getContrastColor } from "@/utils/color";
import * as Chakra from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export default function Form() {
  const profile = useProfileContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (profile === undefined) return <></>;

  return (
    <Chakra.Box>
      <Chakra.Button onClick={onOpen} variant="link" colorScheme="brand">
        Contact
      </Chakra.Button>
      <Modal scrollBehavior="inside" size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={profile.theme.cardBackgroundColor}
          color={getContrastColor(profile.theme.cardBackgroundColor)}
        >
          <ModalHeader>Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>Hi</h1>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Chakra.Box>
  );
}
