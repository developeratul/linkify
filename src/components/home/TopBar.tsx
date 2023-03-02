import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { LogoSrc } from "../common/Logo";

export default function TopBar() {
  return (
    <Chakra.Box p={5} position="fixed" w="full" top={0} left={0}>
      <Chakra.Container maxW="container.xl">
        <Chakra.HStack justify="space-between">
          <Link href="/">
            <Image src={LogoSrc} width={150} alt="Linkify logo" />
          </Link>
          <Chakra.HStack>
            <Chakra.Button colorScheme="purple">Join WaitList</Chakra.Button>
          </Chakra.HStack>
        </Chakra.HStack>
      </Chakra.Container>
    </Chakra.Box>
  );
}
