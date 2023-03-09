import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const Sections = dynamic(() => import("@/components/app/links/Sections"));
const SocialLinks = dynamic(() => import("@/components/app/links/SocialLinks"));

const AppPage: NextPageWithLayout = () => {
  return (
    <Chakra.VStack w="full" maxW="2xl" spacing={10}>
      <Sections />
      <SocialLinks />
    </Chakra.VStack>
  );
};

export default AppPage;
AppPage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { username: true, bio: true },
  });

  if (!user?.username) {
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
