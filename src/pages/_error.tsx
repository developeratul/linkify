import { SEO } from "@/components/common/SEO";
import * as Chakra from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";

interface ErrorProps {
  statusCode: number | undefined;
  message: string;
}

const Error: NextPage<ErrorProps> = (error) => {
  console.log({ error });
  return (
    <Chakra.Center bg="purple.50" w="full" h="100vh">
      <SEO title="Error" />
      <Chakra.Card w="full" maxW="container.sm" bg="white">
        <Chakra.CardBody>
          <Chakra.CardHeader>
            <Chakra.VStack spacing={3} w="full" align="start">
              <Chakra.Heading size="lg" color="red.500">
                {error.statusCode}
              </Chakra.Heading>
              <Chakra.Text>{error.message}</Chakra.Text>
              {error.statusCode && error.statusCode >= 500 && (
                <Chakra.Text fontSize="sm">
                  Please report us that issue through{" "}
                  <Chakra.Button variant="link" as="a" href="mailto:devr@linkifyapp.com">
                    email{" "}
                  </Chakra.Button>
                </Chakra.Text>
              )}
            </Chakra.VStack>
          </Chakra.CardHeader>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.Center>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : "Page Not Found";

  return { statusCode, message };
};

export default Error;
