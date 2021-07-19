import Create from "../components/service/project/create";
import { Layout } from "../components/layout";
import React from "react";

export default function CodePages(pageProps: any) {
  return (
    <Layout {...pageProps}>
      <Create />
    </Layout>
  );
}
