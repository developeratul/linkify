import { Icons } from "@/Icons";
import { redirectAuth } from "@/server/auth";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";

const AuthPage: NextPage = () => {
  const handleSignIn = async (provider: BuiltInProviderType) => {
    await signIn(provider);
  };
  return (
    <Chakra.VStack
      w="full"
      h="full"
      overflowX="hidden"
      justify="center"
      bg="gray.100"
      p={2}
    >
      <Chakra.VStack gap={5} w="full" maxW="md">
        <Chakra.Heading>Welcome to LinkTree 🎉</Chakra.Heading>
        <Chakra.Card size="lg" w="full" bg="white">
          <Chakra.CardBody>
            <Chakra.VStack gap={1}>
              <Chakra.Button
                onClick={() => handleSignIn("github")}
                leftIcon={Icons.Github}
                w="full"
                colorScheme="purple"
              >
                Sign in with Github
              </Chakra.Button>
              <Chakra.Button
                leftIcon={Icons.Google}
                w="full"
                colorScheme="purple"
              >
                Sign in with Google
              </Chakra.Button>
            </Chakra.VStack>
          </Chakra.CardBody>
        </Chakra.Card>
      </Chakra.VStack>
    </Chakra.VStack>
  );
};

export default AuthPage;
export const getServerSideProps: GetServerSideProps = redirectAuth(async () => {
  return {
    props: {},
  };
});
