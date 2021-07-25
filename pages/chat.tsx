import React from "react";
import { Layout } from "../components/layout";
import Chat from "../components/service/chat/chat";

export default function ChatPages(pageProps: any) {
  return (
    <Layout {...pageProps}>
      <Chat {...pageProps} />
    </Layout>
  );
}
