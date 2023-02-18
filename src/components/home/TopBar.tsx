import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { LogoSrc } from "../common/Logo";

export default function TopBar() {
  return (
    <Chakra.Box p={5}>
      <Chakra.Container maxW="container.xl">
        <Chakra.HStack justify="space-between">
          <Link href="/">
            <Image src={LogoSrc} width={150} alt="LinkVault logo" />
          </Link>
          <Chakra.HStack>
            <Chakra.Button
              as={Link}
              href="/app"
              fontWeight="light"
              colorScheme="purple"
            >
              Get Started
            </Chakra.Button>
          </Chakra.HStack>
        </Chakra.HStack>
      </Chakra.Container>
    </Chakra.Box>
  );
}
