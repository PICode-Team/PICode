import React from "react";
import Setting from "../components/service/setting/setting";

export default function SettingPages(pageProps: any) {
  return (
    <React.Fragment>
      <Setting {...pageProps} />
    </React.Fragment>
  );
}
