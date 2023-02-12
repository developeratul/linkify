import { BackgroundImage } from "@/components/app/appearance/BackgroundImage";
import { Font } from "@/components/app/appearance/Font";
import { Profile } from "@/components/app/appearance/Profile";
import { Theme } from "@/components/app/appearance/Theme";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import * as Chakra from "@chakra-ui/react";

const AppearancePage: NextPageWithLayout = () => {
  return (
    <Chakra.VStack w="full" maxW="2xl" spacing="10">
      <Profile />
      <Theme />
      <BackgroundImage />
      <Font />
    </Chakra.VStack>
  );
};

export default AppearancePage;
AppearancePage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
export { getServerSideProps } from "./index";
