import React from "react"
import { Layout } from "../../components/layout";
import Issue from "../../components/service/manage/issue/issue";

export default function IssuePage(pageProps: any) {
    return <Layout {...pageProps}>
        <Issue {...pageProps} />
    </Layout>

}