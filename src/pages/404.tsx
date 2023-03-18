import { Button, Card, CardBody, Center, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center bg="purple.50" w="full" minH="100vh">
      <Card bg="white" w="full" maxW="md">
        <CardBody>
          <VStack align="start" spacing={5}>
            <Heading fontSize="xl" color="purple.500">
              404 | Not found
            </Heading>
            <Text>You navigated to a page which does not exist.</Text>
            <Button colorScheme="purple" as={Link} href="/">
              Back to home
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
}
