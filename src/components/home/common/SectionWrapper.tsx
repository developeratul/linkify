import type { BoxProps } from "@chakra-ui/react";
import { Box, Container } from "@chakra-ui/react";
import React from "react";

type SectionWrapperProps = {
  children: React.ReactNode;
  id: string;
} & BoxProps;

export default function SectionWrapper(props: SectionWrapperProps) {
  const { children, id, as = "section", ...restProps } = props;
  return (
    <Box as={as} id={id} {...restProps}>
      <Container maxW="container.xl">{children}</Container>
    </Box>
  );
}
