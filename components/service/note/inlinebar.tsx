import React, { useRef } from "react";
import { noteStyle } from "../../../styles/service/note/note";
import clsx from "clsx"
import { useEffect } from "react";
import { clone, cloneDeep } from "lodash"
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Height } from "@material-ui/icons";

interface INoteContent {
    text: string;
    contet?: any;//table 이나 이미지 같은 거 넣을 때 사용할 듯
    type?: string;
}

export default function TestNote() {
    const classes: any = noteStyle();
    const [cursor, setCursor] = React.useState<string>();
    const [test, setTest] = React.useState<INoteContent[]>([]);

    useEffect(() => {
        if (cursor === undefined) return;
        document.getElementById(cursor)?.focus();
    }, [cursor])

    useEffect(() => {

    }, [test])

    return <div className={classes.root}>
        <div className={classes.fileView}>
        </div>
        <div id="writeSomeThing" className={classes.content}>
            <div className={classes.title}>
                <div className={classes.titleContent}>
                    <input className={clsx(classes.defaultInput, classes.h1Input)} placeholder={"제목"} />
                    <input className={clsx(classes.defaultInput, classes.h2Input)} placeholder={"작성자"} />
                    <input className={clsx(classes.defaultInput, classes.h3Input)} placeholder={"구분"} />
                    <input className={clsx(classes.defaultInput, classes.h3Input)} placeholder={"날짜"} />
                </div>
            </div>
            <div className={classes.writeRoot} onKeyDown={(e) => {
                if (e.keyCode == 90 && e.ctrlKey) alert("Ctrl+z");
            }}>
                <div id="writeContent" className={classes.writeContent} onClick={(e) => {
                    let tmpContent = cloneDeep(test);
                    if (tmpContent[tmpContent.length - 1]?.text === "") return;
                    tmpContent.push({
                        text: ""
                    })
                    setTest(tmpContent)
                    setCursor(String(tmpContent.length - 1))
                }}>
                    {test.map((v: INoteContent, idx: number) => {
                        return <div key={idx} style={{ height: "fit-content", width: "100%" }} onClick={(e) => { e.stopPropagation(); }}
                            onMouseOver={() => {
                                let tool = document.getElementById(`${idx}tool`);
                                if (tool) { tool.style.visibility = "visible"; }
                            }}
                            onMouseOut={() => {
                                let tool = document.getElementById(`${idx}tool`);
                                if (tool) { tool.style.visibility = "hidden"; }
                            }}>
                            <div className={classes.leftTool} id={`${idx}tool`} >
                                <IconButton style={{ float: "left", width: "16px", height: "16px" }}>
                                    <DragIndicatorIcon />
                                </IconButton>
                                <IconButton style={{ float: "left", width: "16px", height: "16px" }}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div className={classes.write}>
                                <input className={classes.defaultInput} />

                                <input
                                    className={clsx(classes.defaultInput, v.type !== undefined && classes[v.type])}
                                    id={String(idx)}
                                    placeholder={"내용을 입력해주세요."}
                                    value={v.text}
                                    onChange={(e: any) => {
                                        let tmpheight = document.getElementById(`${idx}`)
                                        if (tmpheight) {
                                            tmpheight.style.height = `${tmpheight.scrollHeight}px`
                                        }
                                        let tmpContent = cloneDeep(test);
                                        tmpContent[idx].text = e.target.value;
                                        setTest(tmpContent)
                                    }}
                                    onKeyDown={(event: any) => {
                                        if (event.key === "Enter") {
                                            if (event.target.value === "/h1") {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent[idx].text = ""
                                                tmpContent[idx].type = "h1Input"
                                                setTest(tmpContent)
                                            } else {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent.splice(idx + 1, 0, { text: "" })
                                                setTest(tmpContent)
                                                setCursor(String(idx + 1))
                                            }
                                        } else if (event.key === "Backspace" && event.target.value === "") {
                                            if (v.type !== undefined) {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent[idx].type = undefined;
                                                setTest(tmpContent)
                                            } else {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent.splice(idx, 1)
                                                setTest(tmpContent)
                                                setCursor(String(idx - 1))
                                            }
                                        } else if (event.key === "ArrowDown") {
                                            if (document.getElementById(`${idx + 1}`) === null) return;
                                            document.getElementById(`${idx + 1}`)?.focus()
                                        } else if (event.key === "ArrowUp") {
                                            if (idx === 0) return;
                                            document.getElementById(`${idx - 1}`)?.focus()
                                        }
                                    }} />
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div >;
}
