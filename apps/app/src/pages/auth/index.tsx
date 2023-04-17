import { SEO } from "@/components/common/SEO";
import { AuthLayout } from "@/Layouts/auth";
import { redirectAuth } from "@/server/auth";
import { Button, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import type { GetServerSideProps, NextPage } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";

const AuthPage: NextPage = () => {
  const handleSignIn = async (provider: BuiltInProviderType) => {
    await signIn(provider);
  };
  return (
    <AuthLayout title="Welcome to Linkify 🎉">
      <SEO title="Sign in" description="Sign into Linkify to start setting up your tree!" />
      <VStack spacing={3}>
        <Button
          onClick={() => handleSignIn("github")}
          leftIcon={<Icon name="Github" />}
          w="full"
          colorScheme="purple"
        >
          Sign in with Github
        </Button>
        <Button
          leftIcon={<Icon name="Google" />}
          w="full"
          colorScheme="purple"
          onClick={() => handleSignIn("google")}
        >
          Sign in with Google
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default AuthPage;
export const getServerSideProps: GetServerSideProps = redirectAuth(async () => {
  return {
    props: {},
  };
});
