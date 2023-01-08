import { Icons } from "@/Icons";
import { AuthLayout } from "@/Layouts/auth";
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
    <AuthLayout title="Welcome to LinkTree 🎉">
      <Chakra.VStack spacing={3}>
        <Chakra.Button
          onClick={() => handleSignIn("github")}
          leftIcon={Icons.Github}
          w="full"
          colorScheme="purple"
        >
          Sign in with Github
        </Chakra.Button>
        <Chakra.Button leftIcon={Icons.Google} w="full" colorScheme="purple">
          Sign in with Google
        </Chakra.Button>
      </Chakra.VStack>
    </AuthLayout>
  );
};

export default AuthPage;
export const getServerSideProps: GetServerSideProps = redirectAuth(async () => {
  return {
    props: {},
  };
});
