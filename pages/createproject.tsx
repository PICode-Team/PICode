import { Layout } from "../components/layout";
import React from "react";
import CreateTmp from "../components/service/project/createtmp";

export default function CodePages(pageProps: any) {
    return (
        <Layout {...pageProps}>
            <CreateTmp />
        </Layout>
    );
}
