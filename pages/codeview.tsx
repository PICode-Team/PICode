import { Layout } from "../components/layout";
import React from "react";
import CodeView from "../components/service/codeview";

export default function CodePages(pageProps: any) {
    return (
        <Layout {...pageProps}>
            <CodeView {...pageProps} />
        </Layout>
    );
}
