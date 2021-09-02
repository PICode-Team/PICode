import { Layout } from "../../components/layout";
import React from "react";
import Create from "../../components/service/project/create";

export default function CodePages(pageProps: any) {
    return (
        <Layout {...pageProps}>
            <Create />
        </Layout>
    );
}
