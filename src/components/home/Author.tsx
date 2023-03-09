import Ratul from "@/assets/ratul.jpg";
import { SocialIcon } from "@/Icons";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import JoinWaitListButton from "./common/JoinWaitList";
import SectionWrapper from "./common/SectionWrapper";

export default function Author() {
  return (
    <SectionWrapper bg="purple.100" id="author">
      <Chakra.VStack spacing={10}>
        <Chakra.Heading size="lg">
          Who is building <b>Linkify</b>
        </Chakra.Heading>
        <Chakra.HStack
          flexDirection={{ base: "column", lg: "row" }}
          w="full"
          justify={{ base: "center", lg: "space-between" }}
          maxW="container.xl"
          spacing={{ base: 0, lg: 10 }}
          rowGap={{ base: 10, lg: 0 }}
          align={{ base: "center", lg: "start" }}
        >
          <Image src={Ratul} alt="Minhazur Rahaman Ratul" width={300} className="rounded-lg" />
          <Chakra.VStack align="start" spacing={5}>
            <Chakra.Heading size="md" color="purple.500">
              Minhazur Rahaman Ratul
            </Chakra.Heading>
            <Chakra.VStack spacing={3}>
              <Chakra.Text>
                Hi! I am Ratul a full stack developer from Bangladesh 🇧🇩. I have been coding
                professionally for more than 2 years. But I was doing it privately. No one knew what
                I was doing. I came across Twitter and met a lot of developers out there. They all
                were building and sharing their journey which attracted my interest. So, I took
                inspiration from there and started working on Linkify. This is going to be my first
                ever <Chakra.Code>#buildinpublic</Chakra.Code> project.
              </Chakra.Text>
              <Chakra.Text>
                Linkify aims to provide you everything you need in one place in order to connect
                with your audience effectively. It will be an all-in-one tool that gives you the
                ability to set up an amazing profile page that you can customize in any way you see
                fit. You will showcase your links there. You can collect testimonials from your
                audience, you can collect form submissions from them and also they can subscribe to
                your newsletter which you will run while being a subscriber of my app. So if that
                interests you, you may join our wait list to be among the first to use this. I
                assure you that the wait will be worthwhile.
              </Chakra.Text>
            </Chakra.VStack>
            <Chakra.HStack flexWrap="wrap" rowGap={3} spacing={3}>
              <JoinWaitListButton />
              <Chakra.IconButton
                href="http://twitter.com/developeratul"
                as="a"
                target="_blank"
                aria-label="Minhazur Rahaman Ratul Twitter"
                colorScheme="twitter"
                icon={<SocialIcon name="IconBrandTwitter" />}
              />
              <Chakra.IconButton
                href="https://www.linkedin.com/in/minhazur-rahman-ratul-407352211"
                as="a"
                target="_blank"
                aria-label="Minhazur Rahaman Ratul LinkedIn"
                colorScheme="linkedin"
                icon={<SocialIcon name="IconBrandLinkedin" />}
              />
              <Chakra.IconButton
                href="http://github.com/developeratul"
                as="a"
                target="_blank"
                aria-label="Minhazur Rahaman Ratul Github"
                colorScheme="blackAlpha"
                icon={<SocialIcon name="IconBrandGithub" />}
              />
            </Chakra.HStack>
          </Chakra.VStack>
        </Chakra.HStack>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
