import Code from "../components/service/code";
import { Layout } from "../components/layout";
import React from "react";
import { AppContext, AppInitialProps } from "next/app";


export default function CodePages(pageProps: any) {
  return (
    <Layout {...pageProps}>
      <Code />
    </Layout>
  );
}

