import { LogoSrc } from "@/components/common/Logo";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export type AuthLayoutProps = {
  title: string;
} & AppProps;

export function AuthLayout(props: AuthLayoutProps) {
  const { children, title } = props;
  return (
    <Chakra.VStack w="full" h="100vh" overflowX="hidden" justify="center" bg="purple.50" p={2}>
      <Chakra.VStack spacing={10} w="full" maxW="md">
        <Link href="/">
          <Image width={250} src={LogoSrc} alt="Linkify logo" />
        </Link>
        <Chakra.Heading>{title}</Chakra.Heading>
        <Chakra.Card size="lg" w="full" bg="white">
          <Chakra.CardBody>{children}</Chakra.CardBody>
        </Chakra.Card>
      </Chakra.VStack>
    </Chakra.VStack>
  );
}
