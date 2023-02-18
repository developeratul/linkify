import { Center, Spinner, VStack } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center w="full" h="full">
      <Spinner colorScheme="purple" />
    </Center>
  );
}

export function SectionLoader() {
  return (
    <VStack
      w="full"
      borderWidth={2}
      borderStyle="dashed"
      bg="purple.100"
      borderColor="purple.300"
      py={10}
      px={5}
      justify="center"
      align="center"
      rounded="md"
    >
      <Spinner colorScheme="purple" />
    </VStack>
  );
}
