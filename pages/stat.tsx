import React from "react";
import Stat from "../components/service/stat/stat";

export default function StatPages(pageProps: any) {
  return (
    <React.Fragment>
      <Stat {...pageProps} />
    </React.Fragment>
  );
}
