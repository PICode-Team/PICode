import React from "react";
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import Editor from "draft-js-plugins-editor";
import { noteStyle } from "../../../styles/service/note/note";
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import "draft-js/dist/Draft.css";
import { useState } from "react";
import { useEffect } from "react";


export default function Note() {
    const classes = noteStyle();
    const [test, setState] = useState(false);
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty())
    const [editorPlugins, setEditorPlugins] = React.useState([createMarkdownShortcutsPlugin(), createBlockDndPlugin(), createInlineToolbarPlugin()])
    const editor = React.useRef(null);

    const focus = React.useCallback(() => {
        if (editor.current) (editor.current as any).focus()
    }, [])

    useEffect(() => {
        setState(true)
    }, [])

    const onChange = React.useCallback(editorState => {
        console.log(editorState)
        setEditorState(editorState)
    }, [])

    useEffect(() => {
        console.log(editorState)
    }, [editorState])

    return (
        <div className={classes.root}>
            <div className={classes.fileView}></div>
            <div className={classes.writeContent} onClick={focus}>
                {test && <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={onChange}
                    placeholder="Write something!"
                    plugins={editorPlugins}
                />}
            </div>
        </div>
    )
}