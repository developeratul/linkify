import { ChakraProvider } from "@chakra-ui/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import ProgressBar from "nextjs-progressbar";

import { RootLayout } from "@/Layouts/root";
import { theme } from "@/styles/theme";
import type { NextPage } from "next";
import "../styles/globals.css";
import { api } from "../utils/api";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: {
    session: Session | null;
  };
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <ChakraProvider resetCSS theme={theme}>
        <ProgressBar color="#805AD5" />
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
