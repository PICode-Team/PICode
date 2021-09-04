import React from "react";
import ClientOnly from "../components/client-only";
import { Layout } from "../components/layout";
import TestNote from "../components/service/note/inlinebar";

export default function NotePages(pageProps: any) {
    return <Layout {...pageProps}>
        <TestNote {...pageProps} />
    </Layout>
}