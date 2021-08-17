import Manage from "../../components/service/manage";
import { Layout } from "../../components/layout";
import React from "react";

export default function ManagePages(pageProps: any) {
    return (
        <Layout {...pageProps}>
            <Manage />
        </Layout>
    );
}
