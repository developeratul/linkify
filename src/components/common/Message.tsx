import * as Chakra from "@chakra-ui/react";

export function EmptyMessage(props: { title: string; description: string }) {
  const { title, description } = props;
  return (
    <Chakra.Box
      w="full"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.300"
      py={10}
      px={5}
      rounded="md"
    >
      <Chakra.VStack margin="auto" textAlign="center" w="full" maxW="md">
        <Chakra.Heading size="lg">{title}</Chakra.Heading>
        <Chakra.Text color="GrayText">{description}</Chakra.Text>
      </Chakra.VStack>
    </Chakra.Box>
  );
}

export function ErrorMessage(props: { description: string }) {
  const { description } = props;
  return (
    <Chakra.Box
      w="full"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="red.300"
      py={10}
      px={5}
      rounded="md"
    >
      <Chakra.VStack margin="auto" textAlign="center" w="full" maxW="md">
        <Chakra.Heading size="lg" color="red.500">
          Application Error
        </Chakra.Heading>
        <Chakra.Text>{description}</Chakra.Text>
      </Chakra.VStack>
    </Chakra.Box>
  );
}
