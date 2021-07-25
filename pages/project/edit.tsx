import { Layout } from "../../components/layout";
import React from "react";
import EditProject from "../../components/service/project/edit";

export default function CodePages(pageProps: any) {
    return (
        <Layout {...pageProps}>
            <EditProject />
        </Layout>
    );
}
