import React from "react";
import { Layout } from "../components/layout";
import Contatiner from "../components/service/container/container";

export default function ContainerPage(pageProps: any) {
    return <Layout {...pageProps}>
        <Contatiner />
    </Layout>
}