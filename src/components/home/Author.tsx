import * as Chakra from "@chakra-ui/react";
import SectionWrapper from "./common/SectionWrapper";

export default function Author() {
  return (
    <SectionWrapper id="author">
      <Chakra.VStack spacing={10}>
        <Chakra.Heading fontFamily="monospace" size="lg">
          Who is building <b>Linkify</b>
        </Chakra.Heading>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
