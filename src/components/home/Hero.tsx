import * as Chakra from "@chakra-ui/react";
import JoinWaitListButton from "./common/JoinWaitList";
import SectionWrapper from "./common/SectionWrapper";
import SupportUsButton from "./common/SupportUs";

export default function Hero() {
  return (
    <SectionWrapper id="hero" py={{ base: "52", lg: "64" }}>
      <Chakra.VStack align="center">
        <Chakra.VStack align="start" spacing="50">
          <Chakra.VStack align="start" spacing="10">
            <Chakra.Stack
              flexDirection={{ base: "column", sm: "row" }}
              align={{ base: "start", sm: "center" }}
              gap={5}
            >
              <a
                href="https://www.producthunt.com/posts/linkify?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-linkify"
                target="_blank"
                rel="noreferrer"
              >
                <Chakra.Image
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=383424&theme=light"
                  alt="Linkify - The&#0032;one&#0032;link&#0032;that&#0032;connects&#0032;your&#0032;audience | Product Hunt"
                  width={230}
                  height={50}
                />
              </a>
              <Chakra.Badge
                colorScheme="purple"
                fontSize={{ base: "md", lg: "lg" }}
                letterSpacing="widest"
              >
                Pre-launch
              </Chakra.Badge>
            </Chakra.Stack>
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
          <Chakra.Stack
            flexDirection={{ base: "column", sm: "row" }}
            align={{ base: "start", sm: "center" }}
            w="full"
            gap={3}
          >
            <JoinWaitListButton size={{ base: "md", lg: "lg" }} w={{ base: "full", sm: "auto" }} />
            <SupportUsButton
              variant="outline"
              size={{ base: "md", lg: "lg" }}
              w={{ base: "full", sm: "auto" }}
            />
          </Chakra.Stack>
        </Chakra.VStack>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
