import { HStack, VStack } from "@chakra-ui/react";
import Form from "./Form";

export default function Footer() {
  return (
    <VStack w="full">
      <HStack spacing={10}>
        <Form />
      </HStack>
    </VStack>
  );
}
