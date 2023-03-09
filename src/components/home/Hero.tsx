import * as Chakra from "@chakra-ui/react";
import JoinWaitListButton from "./common/JoinWaitList";
import SectionWrapper from "./common/SectionWrapper";
import SupportUsButton from "./common/SupportUs";

export default function Hero() {
  return (
    <SectionWrapper id="hero" py={{ base: "52", lg: "64" }}>
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
              lineHeight={{ base: "base", lg: "80px" }}
            >
              The one link that connects your audience
            </Chakra.Heading>
          </Chakra.VStack>
          <Chakra.HStack wrap="wrap" rowGap={{ base: 5, sm: 0 }} spacing={5}>
            <JoinWaitListButton size={{ base: "md", lg: "lg" }} />
            <SupportUsButton variant="outline" size={{ base: "md", lg: "lg" }} />
          </Chakra.HStack>
        </Chakra.VStack>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
