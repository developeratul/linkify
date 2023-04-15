import { HStack, Heading, VStack } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  cta: React.ReactNode;
};

export default function SectionWrapper(props: Props) {
  const { title, children, cta } = props;
  return (
    <VStack gap={2} w="full" align="start">
      <HStack justify="space-between" w="full" align="center">
        <Heading size="md" color="purple.600">
          {title}
        </Heading>
        {cta}
      </HStack>
      {children}
    </VStack>
  );
}
