import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import WebVitals from "@/components/web-vitals";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactElement, ReactNode } from "react";
import React from "react";
import type { NextPage } from "next";
import { Toaster } from "@/components/ui/sonner";
import { StoreProviders } from "@/providers";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [queryClient] = React.useState(() => new QueryClient());
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <WebVitals />
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <StoreProviders>
              {getLayout(<Component {...pageProps} />)}
            </StoreProviders>
          </SessionProvider>
        </HydrationBoundary>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}
