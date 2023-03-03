import * as Chakra from "@chakra-ui/react";
import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  title: string;
};

export default function SectionWrapper(props: SectionWrapperProps) {
  const { title, children } = props;
  return (
    <Chakra.VStack w="full" align="start" spacing="3">
      <Chakra.Heading size="md" fontWeight="medium">
        {title}
      </Chakra.Heading>
      <Chakra.Card w="full" size="lg" bg="white">
        <Chakra.CardBody>{children}</Chakra.CardBody>
      </Chakra.Card>
    </Chakra.VStack>
  );
}
