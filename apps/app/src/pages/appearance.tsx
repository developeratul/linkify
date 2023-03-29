import Button from "@/components/app/appearance/Button";
import Layout from "@/components/app/appearance/Layout";
import { Profile } from "@/components/app/appearance/Profile";
import Theme from "@/components/app/appearance/Theme";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps } from "next";

const AppearancePage: NextPageWithLayout = () => {
  return (
    <Chakra.VStack w="full" maxW="2xl" spacing={10}>
      <Profile />
      <Layout />
      <Theme />
      <Button />
    </Chakra.VStack>
  );
};

AppearancePage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default AppearancePage;
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
