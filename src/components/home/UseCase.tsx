import UseCaseIllus from "@/assets/use-case.svg";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import SectionWrapper from "./common/SectionWrapper";

export default function UseCase() {
  return (
    <SectionWrapper bg="purple.100" id="use-case">
      <Chakra.HStack justify="space-between" align="start">
        <Chakra.VStack>
          <Chakra.Heading fontFamily="monospace" size="lg">
            Who is it for?
          </Chakra.Heading>
        </Chakra.VStack>
        <Chakra.Box w="full" maxW="md">
          <Image src={UseCaseIllus} alt="Boom" />
        </Chakra.Box>
      </Chakra.HStack>
    </SectionWrapper>
  );
}
