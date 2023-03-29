import LogoDark from "@/assets/logo-sm-dark.png";
import LogoLight from "@/assets/logo-sm-light.png";
import { HOMEPAGE_URL } from "@/constants";
import { HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Form from "./Form";

export default function Footer() {
  const { colorMode } = useColorMode();
  const LogoSrc = colorMode === "dark" ? LogoLight : LogoDark;
  return (
    <VStack w="full" gap="20px">
      <HStack spacing={10}>
        <Form />
      </HStack>
      <HStack align="center" as="a" href={HOMEPAGE_URL}>
        <Text>Made with</Text>
        <Image src={LogoSrc} alt="Linkify Logo | The all in one link in bio tool" width={50} />
      </HStack>
    </VStack>
  );
}
