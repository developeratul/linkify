import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "../_app";

const SettingsPage: NextPageWithLayout = () => {
  return <h1>settings</h1>;
};

export default SettingsPage;
SettingsPage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};
