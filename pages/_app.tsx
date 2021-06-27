import '../styles/globals.css'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import React from 'react';
import { CssBaseline } from '@material-ui/core';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <React.Fragment>
      <title>PICODE</title>
      <meta name="description" content="PICODE" />
      <link rel="icon" href="/favicon.ico" />
      <CssBaseline />
      <Component {...pageProps} />
    </React.Fragment>)
}


MyApp.getInitialProps = async ({ Component, ctx }: any) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps = { ...pageProps, theme: "dark", path: ctx.pathname }

  return { pageProps };
}

export default MyApp
