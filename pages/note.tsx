import React from "react";
import { Layout } from "../components/layout";
import TestNote from "../components/service/note/inlinebar";

export default function NotePages(pageProps: any) {
    return <Layout {...pageProps}>
        <TestNote />
    </Layout>
}