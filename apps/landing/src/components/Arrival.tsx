import * as Chakra from "@chakra-ui/react";
import JoinWaitListButton from "./common/JoinWaitList";
import SectionWrapper from "./common/SectionWrapper";

export default function Arrival() {
  return (
    <SectionWrapper bg="white" id="arrival">
      <Chakra.VStack spacing={5} maxW="container.md" mx="auto">
        <Chakra.Heading textAlign="center" size="lg">
          When will it be available?
        </Chakra.Heading>
        <Chakra.Text fontSize="xl" textAlign="center">
          We aim to launch our first version of app by <b>June</b> having
          testimonials, forms, analytics, and the Developer API feature ready.
          The Newsletter feature will be launched by the end of <b>July</b>.
        </Chakra.Text>
        <JoinWaitListButton />
      </Chakra.VStack>
    </SectionWrapper>
  );
}
