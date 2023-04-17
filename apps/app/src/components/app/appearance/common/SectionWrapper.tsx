import { Card, CardBody, Heading, VStack } from "@chakra-ui/react";
import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  title: string;
};

export default function SectionWrapper(props: SectionWrapperProps) {
  const { title, children } = props;
  return (
    <VStack w="full" align="start" spacing="3">
      <Heading size="md">{title}</Heading>
      <Card w="full" size={{ base: "md", sm: "lg" }} bg="white">
        <CardBody>{children}</CardBody>
      </Card>
    </VStack>
  );
}
