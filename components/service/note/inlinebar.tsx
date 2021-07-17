import React, { useRef } from "react";
import { noteStyle } from "../../../styles/service/note/note";
import clsx from "clsx"
import { useEffect } from "react";
import { clone, cloneDeep } from "lodash"
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Backspace, Height } from "@material-ui/icons";

interface INoteContent {
    text: string;
    contet?: any;//table 이나 이미지 같은 거 넣을 때 사용할 듯
    type?: string;
    clicked?: boolean
}

interface IPosition {
    x: number;
    y: number;
    target: number;
}

export default function TestNote() {
    const classes: any = noteStyle();
    const [cursor, setCursor] = React.useState<string>();
    const [test, setTest] = React.useState<INoteContent[]>([]);
    const [show, setShow] = React.useState<boolean>(false);
    const [position, setPosition] = React.useState<IPosition>({ x: 0, y: 0, target: 0 });
    const [highlight, setHighlight] = React.useState<number>(0);
    const [drag, setDrag] = React.useState("");

    let tmpPosition: any = [];

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
                    <input className={clsx(classes.defaultTitle, classes.h1Input)} placeholder={"제목"} />
                    <input className={clsx(classes.defaultTitle, classes.h2Input)} placeholder={"작성자"} />
                    <input className={clsx(classes.defaultTitle, classes.h3Input)} placeholder={"구분"} />
                    <input className={clsx(classes.defaultTitle, classes.h3Input)} placeholder={"날짜"} />
                </div>
            </div>
            <div className={classes.writeRoot} onKeyDown={(e) => {
                if (e.keyCode == 90 && e.ctrlKey) alert("Ctrl+z");
            }}>
                <div id="writeContent" className={classes.writeContent} onClick={(e) => {
                    let tmpContent = cloneDeep(test);
                    if (show) {
                        setShow(false)
                    }
                    if (tmpContent[tmpContent.length - 1]?.text === "") return;
                    tmpContent.push({
                        text: ""
                    })
                    setTest(tmpContent)
                    setCursor(String(tmpContent.length - 1))
                }}>
                    {show && <div className={classes.settingTool} style={{ left: position.x, top: position.y }}>
                        <div className={classes.settingLine}>
                            <span>
                                Title
                            </span>
                            <button className={classes.settingButton} onClick={(e) => {
                                let leftTool = document.getElementById(`${position.target}tool`);
                                let content = document.getElementById(`${position.target}`);
                                if (leftTool) {
                                    leftTool.style.top = "17px"
                                }
                                let tmpContent = cloneDeep(test);
                                tmpContent[position.target].text = ""
                                tmpContent[position.target].type = "h1Input"
                                if (content) {
                                    content.innerText = ""
                                }
                                setTest(tmpContent)
                            }}>
                                H1
                            </button>
                        </div>
                    </div>}
                    {test.map((v: INoteContent, idx: number) => {
                        return <div key={idx} style={{ height: "fit-content", width: "100%", position: "relative" }}
                            onClick={(e) => { e.stopPropagation(); }}
                            className={clsx(v.clicked && classes.clicked)}
                            onMouseOver={() => {
                                let tool = document.getElementById(`${idx}tool`);
                                if (tool) { tool.style.visibility = "visible"; }
                            }}
                            onMouseOut={() => {
                                let tool = document.getElementById(`${idx}tool`);
                                if (tool) { tool.style.visibility = "hidden"; }
                            }}>
                            <div className={classes.leftTool} id={`${idx}tool`}>
                                <IconButton style={{ float: "left", width: "20px", height: "20px" }}
                                    className={classes.mouseOver}
                                    onClick={(e) => {
                                        let tmpContent = cloneDeep(test);
                                        tmpContent[idx].clicked = true;
                                        setTest(tmpContent)
                                    }} >
                                    <DragIndicatorIcon style={{ width: "20px", height: "20px" }} />
                                </IconButton>
                                <IconButton style={{ float: "left", width: "20px", height: "20px" }} onClick={(e) => {
                                    let tool = document.getElementById(`${idx}tool`);
                                    if (tool) {
                                        setPosition({ x: tool.getBoundingClientRect().left - 10, y: tool.getBoundingClientRect().top - 50, target: idx })
                                        setShow(true)
                                    }

                                }}>
                                    <AddIcon style={{ width: "20px", height: "20px" }} />
                                </IconButton>
                            </div>
                            <div className={classes.write}>
                                <div
                                    className={clsx(classes.defaultInput, v.type !== undefined && classes[v.type])}
                                    id={String(idx)}
                                    onDragStart={(e) => {
                                        console.log(1)
                                        setDrag(e.currentTarget.id)
                                        for (let i in test) {
                                            let node = document.getElementById(`${i}`);
                                            if (node) {
                                                console.log(test)
                                                tmpPosition.push(node.getBoundingClientRect().bottom)
                                            }
                                        }
                                        console.log(tmpPosition)
                                        console.log(2)
                                    }}
                                    onDragEnd={(e) => {
                                        console.log(3)
                                        let tmpContent = cloneDeep(test);
                                        let tmpNode: any = tmpContent.splice(Number(drag), 1)
                                        console.log(tmpPosition)
                                        for (let i in tmpPosition) {
                                            console.log(tmpPosition[i], e.clientY)
                                            if (tmpPosition[i] > e.clientY) {
                                                tmpContent.splice(Number(i) - 1, 0, tmpNode)
                                                setTest(tmpContent)
                                                return;
                                            }
                                        }
                                        console.log(tmpContent)
                                        console.log(4)
                                    }}
                                    contentEditable={true}
                                    placeholder="Plz Input Text"
                                    onInput={(e) => {
                                        console.log(e.currentTarget.textContent)
                                        let tmpContent = cloneDeep(test);
                                        tmpContent[idx].text = e.currentTarget.textContent ?? ""
                                        setTest(tmpContent)
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            if (event.currentTarget.textContent === "/h1") {
                                                let leftTool = document.getElementById(`${idx}tool`);
                                                if (leftTool) {
                                                    leftTool.style.top = "17px"
                                                }
                                                let tmpContent = cloneDeep(test);
                                                tmpContent[idx].text = ""
                                                tmpContent[idx].type = "h1Input"
                                                event.currentTarget.textContent = ""
                                                setTest(tmpContent)
                                            } else {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent.splice(idx + 1, 0, { text: "" })
                                                setTest(tmpContent)
                                                setCursor(String(idx + 1))
                                            }
                                        } else if (event.key === "Backspace") {
                                            if (event.currentTarget.textContent === "") {
                                                event.preventDefault();
                                                if (v.type !== undefined) {
                                                    let tmpContent = cloneDeep(test);
                                                    tmpContent[idx].type = undefined;
                                                    let leftTool = document.getElementById(`${idx}tool`);
                                                    if (leftTool) {
                                                        leftTool.style.top = "0px"
                                                    }
                                                    setTest(tmpContent)
                                                } else {
                                                    let tmpContent = cloneDeep(test);
                                                    tmpContent.splice(idx, 1)
                                                    setTest(tmpContent)
                                                    setCursor(String(idx - 1))
                                                }
                                            } else {
                                                let tmpContent = cloneDeep(test);
                                                tmpContent[idx].text = tmpContent[idx].text.slice(0, -1);
                                                setTest(tmpContent)
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
