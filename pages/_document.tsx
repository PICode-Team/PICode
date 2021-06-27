import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import flush from 'styled-jsx/server';
import React from 'react';
import { ServerStyleSheets } from '@material-ui/core';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: (
                <React.Fragment>
                    {sheets.getStyleElement()}
                </React.Fragment>
            ),
        };
    }


    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
