import * as Chakra from "@chakra-ui/react";
import React from "react";

export function EmptySectionMessage(props: {
  title: string;
  description: string;
  createButton?: React.ReactNode;
}) {
  const { title, description, createButton } = props;
  return (
    <Chakra.Box w="full" borderWidth={1} borderColor="purple.300" py={10} px={5} rounded="md">
      <Chakra.VStack margin="auto" textAlign="center" w="full" maxW="md" spacing={3}>
        <Chakra.Heading size="lg" color="purple.500">
          {title}
        </Chakra.Heading>
        <Chakra.Text color="gray.600">{description}</Chakra.Text>
        {createButton && createButton}
      </Chakra.VStack>
    </Chakra.Box>
  );
}

export function EmptyMessage(props: { title: string; description: string }) {
  const { title, description } = props;
  return (
    <Chakra.Center h="full" w="full" py={10} px={5}>
      <Chakra.VStack margin="auto" textAlign="center" w="full" maxW="md" spacing={3}>
        <Chakra.Heading size="lg" color="gray.600">
          {title}
        </Chakra.Heading>
        <Chakra.Text color="GrayText">{description}</Chakra.Text>
      </Chakra.VStack>
    </Chakra.Center>
  );
}

export function ErrorMessage(props: { description: string }) {
  const { description } = props;
  return (
    <Chakra.Box w="full" borderWidth={2} borderColor="red.300" py={10} px={5} rounded="md">
      <Chakra.VStack margin="auto" textAlign="center" w="full" maxW="md">
        <Chakra.Heading size="lg" color="red.500" fontWeight="medium">
          Application Error
        </Chakra.Heading>
        <Chakra.Text>{description}</Chakra.Text>
      </Chakra.VStack>
    </Chakra.Box>
  );
}
