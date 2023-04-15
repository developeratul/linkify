import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

export function EmptySectionMessage(props: {
  title: string;
  description: string;
  createButton?: React.ReactNode;
}) {
  const { title, description, createButton } = props;
  return (
    <Box w="full" borderWidth={1} borderColor="purple.300" py={10} px={5} rounded="md">
      <VStack margin="auto" textAlign="center" w="full" maxW="md" spacing={3}>
        <Heading size="lg" color="purple.500">
          {title}
        </Heading>
        <Text color="gray.600">{description}</Text>
        {createButton && createButton}
      </VStack>
    </Box>
  );
}

export function EmptyMessage(props: { title: string; description: string }) {
  const { title, description } = props;
  return (
    <Center h="full" w="full" py={10} px={5}>
      <VStack margin="auto" textAlign="center" w="full" maxW="md" spacing={3}>
        <Heading size="lg" color="gray.600">
          {title}
        </Heading>
        <Text color="GrayText">{description}</Text>
      </VStack>
    </Center>
  );
}

export function ErrorMessage(props: { description: string }) {
  const { description } = props;
  return (
    <Box w="full" borderWidth={2} borderColor="red.300" py={10} px={5} rounded="md">
      <VStack margin="auto" textAlign="center" w="full" maxW="md">
        <Heading size="lg" color="red.500" fontWeight="medium">
          Error
        </Heading>
        <Text>{description}</Text>
      </VStack>
    </Box>
  );
}
