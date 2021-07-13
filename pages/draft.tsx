import React from "react";
import { Layout } from "../components/layout";
import Note from "../components/service/note/note";
import TestNote from "../components/service/note/inlinebar";

export default function TmpNotePages(pageProps: any) {
    return <Layout {...pageProps}>
        <Note />
    </Layout>
}