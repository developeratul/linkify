import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export function EmptySectionMessage(props: {
  title: string;
  description: string;
  createButton?: React.ReactNode;
}) {
  const { title, description, createButton } = props;
  return (
    <Box
      w="full"
      borderWidth={0.1}
      bg="purple.100"
      borderColor="purple.200"
      py={10}
      px={5}
      rounded="md"
    >
      <VStack margin="auto" textAlign="center" w="full" maxW="xs" spacing={6}>
        <VStack spacing={3}>
          <Heading fontSize="2xl" color="purple.500">
            {title}
          </Heading>
          <Text color="GrayText" fontSize="md">
            {description}
          </Text>
        </VStack>
        {createButton && createButton}
      </VStack>
    </Box>
  );
}

export function EmptyMessage(props: { title: string; description: string; action?: ReactNode }) {
  const { title, description, action } = props;
  return (
    <Center h="full" w="full" py={10} px={5}>
      <VStack margin="auto" textAlign="center" maxW="md" w="full" spacing={5}>
        <VStack textAlign="center" w="full" spacing={3}>
          <Heading size="lg" color="gray.600">
            {title}
          </Heading>
          <Text color="GrayText">{description}</Text>
        </VStack>
        {action}
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
