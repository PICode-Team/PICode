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

interface IFileView {
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
    const [selectFolder, setSelectFolder] = React.useState<string[]>([]);
    const [addFile, setAddFile] = React.useState<boolean>(false);
    const [tmpFileName, setTmpFileName] = React.useState<string>("");

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
                setFileView(res.data.getDocument);
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

    const findNode = (data: IFileView[] | undefined, title: string) => {
        if (data === undefined) return;
        for (let i in data) {
            if (data[i].title === title) {
                if (data[i].open) {
                    data[i].open = false;
                } else {
                    data[i].open = true;
                }
                break;
            } else {
                if (data[i].children !== undefined) {
                    findNode(data[i].children, title);
                }
            }
        }
    };

    const makeFileView: any = (data: IFileView[], num: number) => {
        return data.map((v: IFileView, idx: number) => {
            let dividePath = v.path.split("/")
            let name = dividePath[dividePath.length - 1]
            return (
                <>
                    <div
                        className={classes.fileRow}
                        key={idx}
                        style={{ paddingLeft: `${16 * num}px` }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (v.isFolder) {
                                let tmpFolderView = cloneDeep(fileView);
                                findNode(tmpFolderView, v.title);
                                setFileView(tmpFolderView);
                            } else {
                                let tmpFile = {
                                    title: name,
                                    creator: v.creator,
                                    createTime: v.createTime,
                                    documentId: v.documentId,
                                    path: v.path
                                }
                                setSelectFile(tmpFile);
                                if (v.content) {
                                    let tmpTest = [{ text: v.content }];
                                    setTest(tmpTest);
                                } else {
                                    setTest([]);
                                }
                            }
                        }}
                    >
                        {v.isFolder ? (
                            <ExpandMoreRoundedIcon
                                style={{
                                    height: "30px",
                                    transition: "all 0.3s",
                                    transform: `${v.open === undefined || !v.open
                                        ? "rotate(-90deg)"
                                        : "rotate(0deg)"
                                        }`,
                                }}
                            />
                        ) : (
                            <DescriptionIcon style={{ height: "30px" }} />
                        )}
                        <div style={{ display: "flex", lineHeight: "30px" }}>{name}</div>
                        <IconButton
                            style={{ position: "absolute", right: 0, padding: 0, height: "30px", paddingRight: "12px" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                client.mutate({
                                    mutation: QueryDelete(v.documentId),
                                });
                                client
                                    .query({
                                        query: GetQuery(),
                                        fetchPolicy: "network-only",
                                    })
                                    .then((res) => {
                                        setFileView(res.data.getDocument);
                                    });
                            }}>
                            <Delete className={classes.buttonColor} />
                        </IconButton>
                    </div>
                    {v.open &&
                        v.children !== undefined &&
                        makeFileView(v.children, num + 1)}
                </>
            );
        });
    };

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
        <div className={classes.root}>
            <div className={classes.fileView}>
                <div className={classes.fileEdit}>
                    <IconButton style={{ position: "absolute", right: 0, padding: 0, paddingRight: "12px" }} onClick={() => {
                        setAddFile(true)
                    }}>
                        <AddIcon className={classes.buttonColor} />
                    </IconButton>
                </div>
                {fileView && makeFileView(fileView, 1)}
                {addFile && <div className={classes.fileRow} style={{ paddingLeft: "16px" }}>
                    <input placeholder={"untitled"}
                        autoFocus
                        onBlur={(e) => {
                            setAddFile(false)
                            if (e.target.value === "") return;
                            setTmpFileName(e.target.value)
                            client.mutate({
                                mutation: QueryCreate(`/${e.target.value}`, ctx.session.userName, ""),
                            });
                            client
                                .query({
                                    query: GetQuery(),
                                    fetchPolicy: "network-only",
                                })
                                .then((res) => {
                                    setFileView(res.data.getDocument);
                                });
                        }}
                        onKeyDown={(e: any) => {
                            if (e.code === "Enter") {
                                setAddFile(false);
                                setTmpFileName(e.target.value)
                                client.mutate({
                                    mutation: QueryCreate(`/${e.target.value}`, ctx.session.userName, ""),
                                });
                                client
                                    .query({
                                        query: GetQuery(),
                                        fetchPolicy: "network-only",
                                    })
                                    .then((res) => {
                                        setFileView(res.data.getDocument);
                                    });

                            }
                        }}
                    />
                    <IconButton
                        style={{ position: "absolute", right: 0, padding: 0, height: "30px", paddingRight: "12px" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddFile(false)
                        }}>
                        <Delete className={classes.buttonColor} />
                    </IconButton>
                </div>}
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
        </div>
    );
}
