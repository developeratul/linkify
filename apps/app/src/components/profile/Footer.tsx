import { HOMEPAGE_URL } from "@/constants";
import { HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
import { LogoSmDark, LogoSmLight } from "assets";
import Image from "next/image";
import Form from "./Form";

export default function Footer() {
  const { colorMode } = useColorMode();
  const LogoSrc = colorMode === "dark" ? LogoSmLight : LogoSmDark;
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
