import type { ColorProps } from "@chakra-ui/react";
import * as Chakra from "@chakra-ui/react";
import type { TablerIconsProps } from "@tabler/icons-react";
import {
  IconApi,
  IconFiles,
  IconGraph,
  IconLink,
  IconMail,
  IconMessages,
} from "@tabler/icons-react";
import SectionWrapper from "./common/SectionWrapper";

type Feature = {
  title: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  color: ColorProps["color"];
};

const features: Feature[] = [
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
        columns={{ base: 1, sm: 2, md: 3 }}
        bg="white"
        rounded="lg"
        shadow="sm"
        p={5}
      >
        {features.map((feature, index) => (
          <Chakra.Box key={index} p={5}>
            <Chakra.VStack spacing="5">
              <Chakra.Heading bg={feature.color} color="white" p={5} rounded="xl">
                <feature.icon size={30} stroke={1.5} />
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
