import type { AppProps } from "@/types";
import { Card, CardBody, Heading, VStack } from "@chakra-ui/react";
import { LogoNav } from "assets";
import Image from "next/image";
import Link from "next/link";

export type AuthLayoutProps = {
  title: string;
} & AppProps;

export function AuthLayout(props: AuthLayoutProps) {
  const { children, title } = props;
  return (
    <VStack w="full" h="100vh" overflowX="hidden" justify="center" bg="purple.50" p={2}>
      <VStack spacing={10} w="full" maxW="md">
        <Link href="/">
          <Image width={250} src={LogoNav} alt="Linkify logo" />
        </Link>
        <Heading size="lg">{title}</Heading>
        <Card size="lg" w="full" bg="white">
          <CardBody>{children}</CardBody>
        </Card>
      </VStack>
    </VStack>
  );
}
