import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../components/layout";
import RecentWork from "../components/service/dashboard/recentwork";
import Login from "../components/service/user/login";
import { RootState } from "../modules";
import { toDark } from "../modules/theme";

export default function Home(pageProps: any) {
  return (
    <React.Fragment>
      {pageProps.session.userId ?
        <Layout {...pageProps}>
          <RecentWork />
        </Layout> : <Login />
      }
    </React.Fragment>
  );
}
