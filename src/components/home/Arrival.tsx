import * as Chakra from "@chakra-ui/react";
import JoinWaitListButton from "./common/JoinWaitList";
import SectionWrapper from "./common/SectionWrapper";

export default function Arrival() {
  return (
    <SectionWrapper bg="purple.100" id="arrival">
      <Chakra.VStack spacing={5} maxW="container.md" mx="auto">
        <Chakra.Heading size="lg" fontFamily="monospace">
          When we will be available?
        </Chakra.Heading>
        <Chakra.Text textAlign="center">
          We aim to launch our app by <b>April</b> having testimonials, forms, and the Developer API
          feature ready and the Newsletter feature will be launched by the end of <b>May</b>. Please
          consider supporting us by joining the wait list 🙏
        </Chakra.Text>
        <JoinWaitListButton />
      </Chakra.VStack>
    </SectionWrapper>
  );
}
