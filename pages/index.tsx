import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../components/layout";
import Dashboard from "../components/service/dashboard";
import Login from "../components/service/user/_login";

export default function Home(pageProps: any) {
  return (
    <React.Fragment>
      {pageProps.session.userId ? (
        <Layout {...pageProps}>
          <Dashboard />
        </Layout>
      ) : (
        <Login />
      )}
    </React.Fragment>
  );
}
