/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import { noteStyle } from "../../../styles/service/note/note";
import clsx from "clsx";
import { useEffect } from "react";
import { clone, cloneDeep } from "lodash";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import client from "../../../apollo/apollo-client";
import GetQuery from "../../grapql/document/get";
import QueryCreate from "../../grapql/document/create";
import QueryDelete from "../../grapql/document/delete";
import QueryUpdate from "../../grapql/document/update";
import { Delete } from "@material-ui/icons";
import NoteContext from "./context";
import NoteSidebar from "./sidebar";

export interface INoteContent {
    text: string;
    content?: any; //table 이나 이미지 같은 거 넣을 때 사용할 듯
    type?: string;
    clicked?: boolean;
}

interface IPosition {
    x: number;
    y: number;
    target: number;
}

export interface IFileView {
    title: string;
    createTime: string;
    type?: string[];
    isFolder?: boolean;
    creator: string[];
    children?: IFileView[];
    content?: INoteContent[];
    open?: boolean;
    documentId: string;
    path: string;
}

export default function TestNote(ctx: any) {
    const classes: any = noteStyle();

    const [cursor, setCursor] = React.useState<string>();
    const [test, setTest] = React.useState<INoteContent[]>([]);
    const [show, setShow] = React.useState<boolean>(false);
    const [position, setPosition] = React.useState<IPosition>({
        x: 0,
        y: 0,
        target: 0,
    });
    const [highlight, setHighlight] = React.useState<number>();
    const [drag, setDrag] = React.useState<string>("");
    const [dragEnd, setDragEnd] = React.useState<boolean>(false);
    const [fileView, setFileView] = React.useState<IFileView[]>();
    const [selectFile, setSelectFile] = React.useState<IFileView>();
    const [addFile, setAddFile] = React.useState<boolean>(false);
    const [tmpFileName, setTmpFileName] = React.useState<string>("");
    const [openContext, setOpenContext] = React.useState<boolean>(false);
    const [contextPosition, setConextPosition] = React.useState<{ x: number, y: number, target: string, path: string }>({
        x: 0, y: 0, target: "", path: ""
    });

    let tmpPosition: any = [];

    useEffect(() => {
        if (cursor === undefined) return;
        document.getElementById(cursor)?.focus();
    }, [cursor]);

    useEffect(() => {
        if (!dragEnd) return;
        let tmpContent = cloneDeep(test);
        for (let i in test) {
            let node = document.getElementById(`${i}`);
            if (node) {
                node.innerText = test[i].text;
            }
        }
        setHighlight(undefined);
        setDragEnd(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragEnd]);

    useEffect(() => {
        console.log(ctx)
        if (selectFile === undefined) return;
        if (selectFile.documentId === undefined && selectFile.path === "") return;
        let path = selectFile?.path.split("/")
        if (selectFile.title === undefined) {
            setSelectFile({ ...selectFile, title: path[path.length - 1] })
            return
        };
        path[path?.length - 1] = selectFile?.title;
        let tmpPath = path?.join("/");
        let content = test;
        client.mutate({
            mutation: QueryUpdate(selectFile?.documentId, tmpPath, content)
        })
        client
            .query({
                query: GetQuery(),
                fetchPolicy: "network-only",
            })
            .then((res) => {
                let tmpResult = [];
                for (let i of res.data.getDocument) {
                    let node = fileView?.find((v) => v.documentId === i.documentId)
                    if (node !== undefined) {
                        if (node.open) {
                            let tmpNode = node;
                            tmpNode.content = i.content;
                            tmpNode.path = i.path;
                            tmpResult.push(tmpNode)
                        } else {
                            tmpResult.push(i)
                        }
                    }
                }
                setFileView(tmpResult);
            });


        for (let i in test) {
            let node = document.getElementById(`${i}`);
            if (node) {
                node.innerText = test[i].text;
            }
        }
    }, [selectFile]);

    useEffect(() => {
        client
            .query({
                query: GetQuery(),
            })
            .then((res) => {
                setFileView(res.data.getDocument);
            });
    }, []);

    useEffect(() => {
        if (tmpFileName === "") return;
        if (fileView === undefined) return;
        let selectNode = fileView?.find((v: any) => {
            let tmpFile = v.path.split("/");
            let name = tmpFile[tmpFile.length - 1]
            if (name === tmpFileName) {
                setTmpFileName("")
                return true;
            }
        })
        setSelectFile(selectNode)
    }, [fileView]);

    return (
        <div className={classes.root} onClick={() => {
            setOpenContext(false)
            setConextPosition({
                x: 0, y: 0, target: "", path: ""
            })
        }}>
            <div className={classes.fileView}>
                <div className={classes.fileEdit}>
                    <IconButton style={{ position: "absolute", right: 0, padding: 0, paddingRight: "12px" }} onClick={() => {
                        setAddFile(true)
                    }}>
                        <AddIcon className={classes.buttonColor} />
                    </IconButton>
                </div>
                {fileView && <NoteSidebar
                    fileView={fileView}
                    setFileView={setFileView}
                    classes={classes}
                    setTest={setTest}
                    setAddFile={setAddFile}
                    addFile={addFile}
                    setSelectFile={setSelectFile}
                    setOpenContext={setOpenContext}
                    selectFile={selectFile}
                    contextPosition={contextPosition}
                    setContextPosition={setConextPosition}
                    ctx={ctx}
                    client={client}
                />}
            </div>
            {selectFile !== undefined && (
                <div id="writeSomeThing" className={classes.content}>
                    <div className={classes.title}>
                        <div className={classes.titleContent}>
                            <input
                                className={clsx(classes.defaultTitle, classes.h1Input)}
                                placeholder={"제목"}
                                onChange={(e) => {
                                    setSelectFile({ ...selectFile, title: e.target.value });
                                }}
                                value={selectFile.title}
                            />
                            <input
                                className={clsx(classes.defaultTitle, classes.h2Input)}
                                placeholder={"작성자"}
                                value={selectFile.creator}
                            />
                            <input
                                className={clsx(classes.defaultTitle, classes.h3Input)}
                                placeholder={"구분"}
                                value={selectFile.type && selectFile.type.join(", ")}
                            />
                            <input
                                className={clsx(classes.defaultTitle, classes.h3Input)}
                                placeholder={"날짜"}
                                value={selectFile.createTime}
                            />
                        </div>
                    </div>
                    <div
                        className={classes.writeRoot}
                        onKeyDown={(e) => {
                            if (e.keyCode == 90 && e.ctrlKey) alert("Ctrl+z");
                        }}
                    >
                        <div
                            id="writeContent"
                            className={classes.writeContent}
                            onClick={(e) => {
                                let tmpContent = cloneDeep(test);
                                if (show) {
                                    setShow(false);
                                }
                                if (tmpContent[tmpContent.length - 1]?.text === "") {
                                    document
                                        .getElementById(String(tmpContent.length - 1))
                                        ?.focus();
                                    return;
                                }
                                tmpContent.push({
                                    text: "",
                                });
                                setTest(tmpContent);
                                setCursor(String(tmpContent.length - 1));
                            }}
                        >
                            {show && (
                                <div
                                    className={classes.settingTool}
                                    style={{ left: position.x, top: position.y }}
                                >
                                    <div className={classes.settingLine}>
                                        <span>Title</span>
                                        <button
                                            className={classes.settingButton}
                                            onClick={(e) => {
                                                let leftTool = document.getElementById(
                                                    `${position.target}tool`
                                                );
                                                let content = document.getElementById(
                                                    `${position.target}`
                                                );
                                                if (leftTool) {
                                                    leftTool.style.top = "17px";
                                                }
                                                let tmpContent = cloneDeep(test);
                                                tmpContent[position.target].text = "";
                                                tmpContent[position.target].type = "h1Input";
                                                if (content) {
                                                    content.innerText = "";
                                                }
                                                setTest(tmpContent);
                                            }}
                                        >
                                            H1
                                        </button>
                                    </div>
                                </div>
                            )}
                            {test.map((v: INoteContent, idx: number) => {
                                return (
                                    <div
                                        key={idx}
                                        draggable={true}
                                        style={{
                                            height: "fit-content",
                                            width: "100%",
                                            position: "relative",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className={clsx(v.clicked && classes.clicked)}
                                        onMouseOver={() => {
                                            let tool = document.getElementById(`${idx}tool`);
                                            if (tool) {
                                                tool.style.visibility = "visible";
                                            }
                                        }}
                                        onMouseOut={() => {
                                            let tool = document.getElementById(`${idx}tool`);
                                            if (tool) {
                                                tool.style.visibility = "hidden";
                                            }
                                        }}
                                        onDragStart={(e) => {
                                            e.stopPropagation();
                                            let textNode = document.getElementById(`${idx}`);
                                            if (textNode) {
                                                if (e.clientX > textNode.getBoundingClientRect().left) {
                                                    e.preventDefault();
                                                }
                                            }
                                            setDrag(e.currentTarget.id);
                                            for (let i in test) {
                                                let node = document.getElementById(`${i}`);
                                                if (node) {
                                                    tmpPosition.push(node.getBoundingClientRect().bottom);
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            let tmpContent = cloneDeep(test);
                                            tmpContent[idx].clicked = false;
                                            setHighlight(undefined);
                                            setTest(tmpContent);
                                        }}
                                        onMouseUpCapture={(e) => {
                                            let nodePosition = document.getElementById(`${idx}`);
                                            let tmpContent = cloneDeep(test);
                                            if (highlight !== undefined) {
                                                if (tmpContent[highlight]) {
                                                    tmpContent[highlight].clicked = false;
                                                }
                                            }
                                            if (window && nodePosition) {
                                                if (
                                                    window.getSelection()?.toString() === v.text &&
                                                    e.clientX < nodePosition.getBoundingClientRect().left
                                                ) {
                                                    tmpContent[idx].clicked = true;
                                                    setHighlight(idx);
                                                }
                                            }
                                            setTest(tmpContent);
                                        }}
                                        onDragOver={(e) => {
                                            let node = document.getElementById(`${idx}`);
                                            if (node) {
                                                node.style.borderTop = "1px solid #fff";
                                            }
                                        }}
                                        onDragLeave={(e) => {
                                            let node = document.getElementById(`${idx}`);
                                            if (node) {
                                                node.style.borderTop = "0px";
                                            }
                                        }}
                                        onDragEnd={(e) => {
                                            let tmpContent = cloneDeep(test);
                                            let tmpNode: any = tmpContent.splice(Number(drag), 1);
                                            let lastCheck = true;
                                            for (let i in tmpPosition) {
                                                if (tmpPosition[i] > e.clientY) {
                                                    tmpContent.splice(Number(i) - 1, 0, tmpNode[0]);
                                                    setTest(tmpContent);
                                                    lastCheck = false;
                                                    setDragEnd(true);
                                                    return;
                                                }
                                            }
                                            if (lastCheck) {
                                                tmpContent = tmpContent.concat(tmpNode);
                                                setTest(tmpContent);
                                                setDragEnd(true);
                                            }
                                        }}
                                    >
                                        <div className={classes.leftTool} id={`${idx}tool`}>
                                            <IconButton
                                                style={{
                                                    cursor: "move",
                                                    float: "left",
                                                    width: "20px",
                                                    height: "20px",
                                                }}
                                                className={classes.mouseOver}
                                                onClick={(e) => {
                                                    let tmpContent = cloneDeep(test);
                                                    tmpContent[idx].clicked = true;
                                                    setTest(tmpContent);
                                                }}
                                                onMouseDown={(e) => {
                                                    //
                                                }}
                                            >
                                                <DragIndicatorIcon
                                                    className={classes.iconButtonColor}
                                                />
                                            </IconButton>
                                            <IconButton
                                                style={{ float: "left", width: "20px", height: "20px" }}
                                                onClick={(e) => {
                                                    let tool = document.getElementById(`${idx}tool`);
                                                    if (tool) {
                                                        setPosition({
                                                            x: tool.getBoundingClientRect().left - 10,
                                                            y: tool.getBoundingClientRect().top - 50,
                                                            target: idx,
                                                        });
                                                        setShow(true);
                                                    }
                                                }}
                                            >
                                                <AddIcon className={classes.iconButtonColor} />
                                            </IconButton>
                                        </div>
                                        <div className={classes.write}>
                                            <div
                                                className={clsx(
                                                    classes.defaultInput,
                                                    v.type !== undefined && classes[v.type]
                                                )}
                                                id={String(idx)}
                                                contentEditable={true}
                                                onSelect={(e) => {
                                                    let node = document.getElementById(`${idx}`);
                                                    if (node) {
                                                        node?.setAttribute("placeholder", "Plz Input Text");
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    let node = document.getElementById(`${idx}`);
                                                    if (node) {
                                                        node?.setAttribute("placeholder", "");
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    let tmpContent = cloneDeep(test);
                                                    tmpContent[idx].text =
                                                        e.currentTarget.textContent ?? "";
                                                    setTest(tmpContent);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        if (event.currentTarget.textContent === "/h1") {
                                                            let leftTool = document.getElementById(
                                                                `${idx}tool`
                                                            );
                                                            if (leftTool) {
                                                                leftTool.style.top = "17px";
                                                            }
                                                            let tmpContent = cloneDeep(test);
                                                            tmpContent[idx].text = "";
                                                            tmpContent[idx].type = "h1Input";
                                                            event.currentTarget.textContent = "";
                                                            setTest(tmpContent);
                                                        } else {
                                                            let tmpContent = cloneDeep(test);
                                                            tmpContent.splice(idx + 1, 0, { text: "" });
                                                            setTest(tmpContent);
                                                            setCursor(String(idx + 1));
                                                        }
                                                    } else if (event.key === "Backspace") {
                                                        if (event.currentTarget.textContent === "") {
                                                            event.preventDefault();
                                                            if (v.type !== undefined) {
                                                                let tmpContent = cloneDeep(test);
                                                                tmpContent[idx].type = undefined;
                                                                let leftTool = document.getElementById(
                                                                    `${idx}tool`
                                                                );
                                                                if (leftTool) {
                                                                    leftTool.style.top = "0px";
                                                                }
                                                                setTest(tmpContent);
                                                            } else {
                                                                let tmpContent = cloneDeep(test);
                                                                tmpContent.splice(idx, 1);
                                                                setTest(tmpContent);
                                                                setCursor(String(idx - 1));
                                                            }
                                                        } else {
                                                            let tmpContent = cloneDeep(test);
                                                            tmpContent[idx].text = tmpContent[idx].text.slice(
                                                                0,
                                                                -1
                                                            );
                                                            setTest(tmpContent);
                                                        }
                                                    } else if (event.key === "ArrowDown") {
                                                        if (document.getElementById(`${idx + 1}`) === null)
                                                            return;
                                                        document.getElementById(`${idx + 1}`)?.focus();
                                                    } else if (event.key === "ArrowUp") {
                                                        if (idx === 0) return;
                                                        document.getElementById(`${idx - 1}`)?.focus();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {openContext && <NoteContext
                classes={classes}
                contextPosition={contextPosition}
                client={client}
                setOpenContext={setOpenContext}
                setFileView={setFileView}
                setSelectFile={setSelectFile}
                fileView={fileView}
                setAddFile={setAddFile}
            />}
        </div>
    );
}
