import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";

export type AuthLayoutProps = {
  title: string;
} & AppProps;

export function AuthLayout(props: AuthLayoutProps) {
  const { children, title } = props;
  return (
    <Chakra.VStack
      w="full"
      h="full"
      overflowX="hidden"
      justify="center"
      bg="purple.50"
      p={2}
    >
      <Chakra.VStack spacing={10} w="full" maxW="md">
        <Image width={250} height={40} src="/logo.png" alt="LinkVault logo" />
        <Chakra.Heading>{title}</Chakra.Heading>
        <Chakra.Card size="lg" w="full" bg="white">
          <Chakra.CardBody>{children}</Chakra.CardBody>
        </Chakra.Card>
      </Chakra.VStack>
    </Chakra.VStack>
  );
}
