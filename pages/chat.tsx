import React from "react";
import Chat from "../components/service/chat/chat";

export default function ChatPages(pageProps: any) {
  return (
    <React.Fragment>
      <Chat {...pageProps} />
    </React.Fragment>
  );
}
