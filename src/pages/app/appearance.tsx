import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";

const AppearancePage: NextPageWithLayout = () => {
  return <h1>Boom</h1>;
};

export default AppearancePage;
AppearancePage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
