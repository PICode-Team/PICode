import "../styles/globals.css";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import React from "react";
import withRedux from 'next-redux-wrapper';
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { darkTheme, whiteTheme } from "../styles/theme";
import wrapper from "../stores";
import { useSelector } from "react-redux";
import { persistReducer } from "redux-persist"

function App({ Component, pageProps }: AppProps) {
  const theme = useSelector((state: any) => state.theme)
  console.log(theme)
  return (
    <React.Fragment>
      <title>PICODE</title>
      <meta name="description" content="PICODE" />
      <link rel="icon" href="/favicon.ico" />

      <ThemeProvider
        theme={theme.theme === "dark" ? darkTheme : whiteTheme}
      >
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>

    </React.Fragment>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps = { ...pageProps, path: ctx.pathname };
  return { pageProps };
};

export default wrapper.withRedux(App)
