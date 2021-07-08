import React from "react";
import { noteStyle } from "../../../styles/service/note/note";
import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";
import { useEffect } from "react";

export default function Note() {
    const classes = noteStyle();
    const [markDown, setMarkdown] = React.useState<string | undefined>("");

    return <div className={classes.root}>
        <div className={classes.fileView}>
        </div>
        <div className={classes.writeContent} id="note">
            <MDEditor
                height={100}
                value={markDown}
                onChange={(value: string | undefined) => setMarkdown(value)}
                fullscreen={false}
                tabSize={2}
            />
        </div>
    </div>
}