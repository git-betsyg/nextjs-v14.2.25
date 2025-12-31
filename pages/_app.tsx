import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/mdx-components";
import Layout from "@/components/layout";
import WebVitals from "@/components/web-vitals";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <WebVitals />
      <SessionProvider session={session}>
        <MDXProvider components={useMDXComponents({})}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MDXProvider>
      </SessionProvider>
    </>
  );
}
