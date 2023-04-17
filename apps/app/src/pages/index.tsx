import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import { VStack } from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const Sections = dynamic(() => import("@/components/app/links/Sections"));
const SocialLinks = dynamic(() => import("@/components/app/links/SocialLinks"));

const AppPage: NextPageWithLayout = () => {
  return (
    <VStack pb={{ base: 55, md: 0 }} w="full" maxW="2xl" spacing={10}>
      <Sections />
      <SocialLinks />
    </VStack>
  );
};

AppPage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default AppPage;
export const getServerSideProps: GetServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { username: true, bio: true },
  });

  if (!user?.username || !user.bio) {
    return {
      redirect: {
        destination: "/auth/onboarding",
        permanent: false,
      },
    };
  }

  return {
    props: { username: user.username },
  };
});
