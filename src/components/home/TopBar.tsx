import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  return (
    <Chakra.Box p={5}>
      <Chakra.Container maxW="container.xl">
        <Chakra.HStack justify="space-between">
          <Image src="/logo.png" width={150} height={25} alt="LinkVault logo" />
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
