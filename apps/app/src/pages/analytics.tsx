import { AppLayout } from "@/Layouts/app";
import * as Chakra from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <Chakra.Box>
      <Chakra.Heading>Analytics</Chakra.Heading>
    </Chakra.Box>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AnalyticsPage;
