import Code from "../components/service/code";
import { Layout } from "../components/layout";
import React from "react";

export default function CodePages(pageProps: any) {
  return (
    <Layout {...pageProps}>
      <Code {...pageProps} />
    </Layout>
  );
}
