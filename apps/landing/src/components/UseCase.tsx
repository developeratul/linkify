import UseCaseImage from "@/assets/use-case.svg";
import * as Chakra from "@chakra-ui/react";
import type { TablerIconsProps } from "@tabler/icons-react";
import {
  IconAccessPoint,
  IconAffiliate,
  IconBrandUpwork,
  IconSchool,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import Image, { type StaticImageData } from "next/image";
import SectionWrapper from "./common/SectionWrapper";

type UseCase = {
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
};

const useCases: UseCase[] = [
  { name: "Freelancers", icon: IconBrandUpwork },
  { name: "Content Creators", icon: IconUserCheck },
  { name: "Influencers", icon: IconAccessPoint },
  { name: "Marketers", icon: IconAffiliate },
  { name: "Coach/Mentors", icon: IconSchool },
  { name: "Affiliates", icon: IconUser },
];

export default function UseCase() {
  return (
    <SectionWrapper id="use-case">
      <Chakra.HStack
        flexDir={{ base: "column-reverse", md: "row" }}
        rowGap={{ base: 10, md: 0 }}
        justify="space-between"
        align={{ base: "center", md: "start" }}
      >
        <Chakra.VStack w="full" align="start" spacing={10}>
          <Chakra.Heading size="lg">Who is it for?</Chakra.Heading>
          <Chakra.VStack w="full">
            <Chakra.SimpleGrid
              w="full"
              spacing={5}
              columns={{ base: 1, lg: 2 }}
            >
              {useCases.map((useCase, index) => (
                <Chakra.HStack
                  key={index}
                  spacing={10}
                  bg="white"
                  shadow="sm"
                  p={5}
                  rounded="2xl"
                >
                  <Chakra.Heading size="lg" color="purple.500">
                    <useCase.icon size={30} />
                  </Chakra.Heading>
                  <Chakra.Text
                    fontWeight="medium"
                    w="full"
                    textAlign="center"
                    fontSize={18}
                  >
                    {useCase.name}
                  </Chakra.Text>
                </Chakra.HStack>
              ))}
            </Chakra.SimpleGrid>
          </Chakra.VStack>
        </Chakra.VStack>
        <Chakra.Box w="full" maxW="md">
          <Image src={UseCaseImage as StaticImageData} alt="Linkify usecase" />
        </Chakra.Box>
      </Chakra.HStack>
    </SectionWrapper>
  );
}
