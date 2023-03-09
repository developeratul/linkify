import * as Chakra from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  cta: React.ReactNode;
};

export default function SectionWrapper(props: Props) {
  const { title, children, cta } = props;
  return (
    <Chakra.VStack gap={2} w="full" align="start">
      <Chakra.HStack justify="space-between" w="full" align="center">
        <Chakra.Heading size="md" color="purple.600">
          {title}
        </Chakra.Heading>
        {cta}
      </Chakra.HStack>
      {children}
    </Chakra.VStack>
  );
}
