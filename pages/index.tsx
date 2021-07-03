import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../components/layout";
import RecentWork from "../components/service/dashboard/recentwork";
import { RootState } from "../modules";
import { toDark } from "../modules/theme";

export default function Home(pageProps: any) {

  return (
    <React.Fragment>
      <Layout {...pageProps}>
        <RecentWork />
      </Layout>
    </React.Fragment>
  );
}
