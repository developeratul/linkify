import { SEO } from "@/components/common/SEO";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";

interface ErrorProps {
  statusCode: number | undefined;
  message: string;
}

const Error: NextPage<ErrorProps> = (error) => {
  return (
    <Center bg="purple.50" w="full" h="100vh">
      <SEO title="Error" />
      <Card w="full" maxW="container.sm" bg="white">
        <CardBody>
          <CardHeader>
            <VStack spacing={3} w="full" align="start">
              <Heading size="lg" color="red.500">
                {error.statusCode}
              </Heading>
              <Text>{error.message}</Text>
              {error.statusCode && error.statusCode >= 500 && (
                <Text fontSize="sm">
                  Please report us that issue through{" "}
                  <Button variant="link" as="a" href="mailto:devr@linkifyapp.com">
                    email{" "}
                  </Button>
                </Text>
              )}
            </VStack>
          </CardHeader>
        </CardBody>
      </Card>
    </Center>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : "Page Not Found";

  return { statusCode, message };
};

export default Error;
