import "../styles/globals.css";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { darkTheme, whiteTheme } from "../styles/theme";
import wrapper from "../stores";
import { useSelector, useStore } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo/apollo-client";

function App({ Component, pageProps }: AppProps) {
  const theme = useSelector((state: any) => state.theme)

  return (
    <React.Fragment>
      <title>PICODE</title>
      <meta name="description" content="PICODE" />
      <link rel="icon" href="/favicon.ico" />
      <ThemeProvider
        theme={theme.theme === "dark" ? darkTheme : whiteTheme}
      >
        <CssBaseline />
        <ApolloProvider client={client} >
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

App.getInitialProps = async ({ Component, ctx }: any): Promise<AppInitialProps> => {

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps = { ...pageProps, path: ctx.pathname, session: ctx.req.session };
  return { pageProps };
};

export default wrapper.withRedux(App)
