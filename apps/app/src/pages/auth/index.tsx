import { SEO } from "@/components/common/SEO";
import { AuthLayout } from "@/Layouts/auth";
import { redirectAuth } from "@/server/auth";
import { Box, Button, IconButton, Text, VStack, useToken } from "@chakra-ui/react";
import { useLocalStorage } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { Icon, TablerIcon } from "components";
import { AnimatePresence, motion } from "framer-motion";
import type { GetServerSideProps, NextPage } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import Link from "next/link";

const AuthPage: NextPage = () => {
  const [purple] = useToken("colors", ["purple.200"]);
  const [isBoxVisible, setIsBoxVisible] = useLocalStorage({
    key: "isBoxVisible",
    defaultValue: true,
    getInitialValueInEffect: true,
    serialize: JSON.stringify,
    deserialize: (value) => !JSON.parse(value),
  });

  const handleSignIn = async (provider: BuiltInProviderType) => {
    await signIn(provider);
  };

  return (
    <AuthLayout title="Welcome to Linkify 🎉">
      <SEO title="Sign in" description="Sign into Linkify to start setting up your tree!" />
      <AnimatePresence>
        {isBoxVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{
              opacity: 0,
              transition: {
                type: "spring",
                stiffness: 150,
                damping: 10,
              },
            }}
          >
            <Box
              position="fixed"
              maxW="sm"
              bottom={4}
              left={4}
              bg="white"
              borderRadius="md"
              borderWidth={1}
              borderColor="purple.100"
              p={4}
              boxShadow={`0 4px 6px -1px ${purple}, 0 2px 4px -1px ${purple}`}
            >
              <Text fontSize="md" mb={6} fontWeight="semibold">
                Do you need a developer to develop your own SaaS project idea?
              </Text>
              <Button
                as={Link}
                href="http://contra.com/minhazratul"
                w="full"
                target="_blank"
                colorScheme="purple"
                variant="outline"
                leftIcon={<TablerIcon name="IconBolt" size={20} />}
              >
                Hire Me
              </Button>
              <IconButton
                position="absolute"
                rounded="full"
                top={-2}
                right={-2}
                size="sm"
                icon={<IconX size={20} />}
                onClick={() => setIsBoxVisible(false)}
                colorScheme="gray"
                aria-label="Close"
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <VStack spacing={3}>
        <Button
          onClick={() => handleSignIn("github")}
          leftIcon={<Icon name="Github" />}
          w="full"
          colorScheme="purple"
        >
          Continue with Github
        </Button>
        <Button
          leftIcon={<Icon name="Google" />}
          w="full"
          colorScheme="purple"
          onClick={() => handleSignIn("google")}
        >
          Continue with Google
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
