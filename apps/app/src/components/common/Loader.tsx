import { Center, Spinner, VStack } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center py={100} w="full" h="full">
      <Spinner colorScheme="purple" />
    </Center>
  );
}

export function SectionLoader() {
  return (
    <VStack
      w="full"
      borderWidth={1}
      bg="purple.100"
      borderColor="purple.200"
      py={24}
      px={5}
      justify="center"
      align="center"
      rounded="md"
    >
      <Spinner colorScheme="purple" color="purple.500" />
    </VStack>
  );
}
