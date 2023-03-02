import * as Chakra from "@chakra-ui/react";
import {
  IconApi,
  IconFiles,
  IconGraph,
  IconLink,
  IconMail,
  IconMessages,
} from "@tabler/icons-react";
import SectionWrapper from "./common/SectionWrapper";

const features = [
  { title: "Unlimited links", icon: IconLink, color: "purple.400" },
  { title: "Profile Analytics", icon: IconGraph, color: "green.400" },
  { title: "Testimonials", icon: IconMessages, color: "blue.400" },
  { title: "Form Submissions", icon: IconFiles, color: "orange.400" },
  { title: "Newsletter", icon: IconMail, color: "cyan.400" },
  { title: "Developer API", icon: IconApi, color: "red.400" },
];

export default function FeaturesSection() {
  return (
    <SectionWrapper id="features-section" py={50}>
      <Chakra.SimpleGrid
        w="full"
        maxW="container.md"
        mx="auto"
        spacing="5"
        columns={3}
        bg="white"
        rounded="lg"
        shadow="base"
        p={5}
      >
        {features.map((feature, index) => (
          <Chakra.Box key={index} p={5}>
            <Chakra.VStack spacing="5">
              <Chakra.Heading color={feature.color || "gray.600"}>
                <feature.icon size={60} stroke={1.5} />
              </Chakra.Heading>
              <Chakra.Text fontFamily="monospace" textAlign="center" color="gray.600" fontSize="lg">
                {feature.title}
              </Chakra.Text>
            </Chakra.VStack>
          </Chakra.Box>
        ))}
      </Chakra.SimpleGrid>
    </SectionWrapper>
  );
}
