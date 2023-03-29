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
  description: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  color: ColorProps["color"];
};

const features: Feature[] = [
  {
    title: "Unlimited links",
    icon: IconLink,
    color: "purple.400",
    description:
      "Create and add unlimited links to your profile to setup a beautiful and iconic profile in minutes.",
  },
  {
    title: "Profile Analytics",
    icon: IconGraph,
    color: "green.400",
    description:
      "Analyze your click counts, page views and take data driven decisions.",
  },
  {
    title: "Testimonials",
    icon: IconMessages,
    color: "blue.400",
    description:
      "Collect testimonials from the visitors and showcase them in your profile.",
  },
  {
    title: "Form Submissions",
    icon: IconFiles,
    color: "orange.400",
    description:
      "Collect form submissions from the visitors and manage them from your dashboard.",
  },
  {
    title: "Newsletter",
    icon: IconMail,
    color: "cyan.400",
    description:
      "Send personalized and automated emails to your subscribers and stay connected.",
  },
  {
    title: "Developer API",
    icon: IconApi,
    color: "red.400",
    description:
      "Get the data of your profile (Links, Testimonials, Form Submissions) through the API and showcase it wherever your want!",
  },
];

export default function FeaturesSection() {
  return (
    <SectionWrapper id="features-section">
      <Chakra.VStack spacing={10} justify="center">
        <Chakra.Heading size="lg" textAlign="center">
          We provide everything you need
        </Chakra.Heading>
        <Chakra.VStack spacing={5} w="full">
          <Chakra.SimpleGrid
            w="full"
            maxW="container.md"
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
                  <Chakra.Heading
                    bg={feature.color}
                    color="white"
                    p={5}
                    rounded="xl"
                  >
                    <feature.icon size={30} stroke={1.5} />
                  </Chakra.Heading>
                  <Chakra.Text
                    textAlign="center"
                    color="gray.600"
                    fontWeight="medium"
                    fontSize="lg"
                  >
                    {feature.title}
                  </Chakra.Text>
                </Chakra.VStack>
              </Chakra.Box>
            ))}
          </Chakra.SimpleGrid>

          <Chakra.VStack
            w="full"
            p={10}
            rounded="lg"
            spacing={10}
            shadow="sm"
            bg="white"
            justify="center"
            align="center"
            maxW="container.md"
          >
            {features.map((feature, index) => (
              <Chakra.HStack
                flexDirection={{ base: "column", md: "row" }}
                align={{ base: "center", md: "start" }}
                key={index}
                spacing={{ base: 0, md: 5 }}
                rowGap={{ base: 5, md: 0 }}
                w="full"
              >
                <Chakra.Heading
                  bg={feature.color}
                  color="white"
                  rounded="lg"
                  p={5}
                >
                  <feature.icon size={50} stroke={1.5} />
                </Chakra.Heading>
                <Chakra.VStack
                  textAlign={{ base: "center", md: "start" }}
                  align="start"
                  w="full"
                  spacing={3}
                >
                  <Chakra.Heading w="full" fontSize="xl">
                    {feature.title}
                  </Chakra.Heading>
                  <Chakra.Text fontWeight="normal" fontSize={19}>
                    {feature.description}
                  </Chakra.Text>
                </Chakra.VStack>
              </Chakra.HStack>
            ))}
          </Chakra.VStack>
        </Chakra.VStack>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
