import { Spinner, VStack } from "@chakra-ui/react";

export default function Loader() {
  return (
    <VStack align="center">
      <Spinner />
    </VStack>
  );
}

export function SectionLoader() {
  return (
    <VStack
      w="full"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.300"
      py={10}
      px={5}
      justify="center"
      align="center"
      rounded="md"
    >
      <Spinner />
    </VStack>
  );
}
