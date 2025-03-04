import type { AppProps } from "@/types";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Card,
  CardBody,
  Image as ChakraImage,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LogoSm } from "assets";
import { Icon } from "components";
import Image from "next/image";
import Link from "next/link";

export type AuthLayoutProps = {
  title: string;
} & AppProps;

const features = [
  { name: "Themes", icon: "Appearance" },
  { name: "Analytics", icon: "Analytics" },
  { name: "Testimonials", icon: "Testimonial" },
  { name: "Forms", icon: "Form" },
];

export function AuthLayout(props: AuthLayoutProps) {
  const { children, title } = props;
  return (
    <VStack w="full" h="100vh" overflowX="hidden" bg="purple.50" p={2}>
      <VStack spacing={6} w="full" maxW="md">
        <Link href="/">
          <Image width={80} src={LogoSm} alt="Linkify logo" />
        </Link>
        <SimpleGrid gap={3} columns={1}>
          <a
            href="https://www.producthunt.com/posts/linkify?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-linkify"
            target="_blank"
            rel="noreferrer"
          >
            <ChakraImage
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=383424&theme=light"
              alt="Linkify - The&#0032;one&#0032;link&#0032;that&#0032;connects&#0032;your&#0032;audience | Product Hunt"
              width={230}
              height={50}
            />
          </a>
        </SimpleGrid>
        <VStack textAlign="center">
          <Heading size="lg">{title}</Heading>
          <Text color="GrayText">A Link-in-bio tool that connects with your audience.</Text>
        </VStack>
        <SimpleGrid columns={4} flexWrap="wrap" w="full" overflow="hidden" className="divide-x">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-1 items-center justify-center gap-1 text-center"
            >
              <Text color="purple.500" className="shrink-0">
                <Icon size={12} name={feature.icon as any} />
              </Text>
              <Text fontSize="xs">{feature.name}</Text>
            </div>
          ))}
        </SimpleGrid>
        <iframe
          style={{ border: "none" }}
          src="https://cards.producthunt.com/cards/reviews/595589?v=1"
          height="315"
          className="w-full"
        ></iframe>
        <Alert status="info" colorScheme="purple" variant="left-accent">
          <AlertIcon />
          <AlertTitle>It's free to get started!</AlertTitle>
        </Alert>
        <Card size="lg" w="full" bg="white">
          <CardBody>{children}</CardBody>
        </Card>
      </VStack>
    </VStack>
  );
}
