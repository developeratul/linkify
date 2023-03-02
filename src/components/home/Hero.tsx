import * as Chakra from "@chakra-ui/react";
import SectionWrapper from "./common/SectionWrapper";

export default function Hero() {
  return (
    <SectionWrapper id="hero" py={{ base: "52", lg: "60" }}>
      <Chakra.VStack align="center">
        <Chakra.VStack align="start" spacing="50">
          <Chakra.VStack align="start" spacing="3">
            <Chakra.Badge
              colorScheme="purple"
              fontSize={{ base: "md", lg: "lg" }}
              letterSpacing="widest"
            >
              Pre-launch
            </Chakra.Badge>
            <Chakra.Heading
              color="gray.600"
              w="full"
              maxW="715"
              fontSize={{ base: "30", sm: "40", md: "50", lg: "60" }}
              fontFamily="monospace"
              lineHeight={{ base: "base", lg: "80px" }}
            >
              The one link that connects your audience
            </Chakra.Heading>
          </Chakra.VStack>
          <Chakra.Button size={{ base: "md", lg: "lg" }} colorScheme="purple">
            Join WaitList
          </Chakra.Button>
        </Chakra.VStack>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
