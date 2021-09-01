import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { cloneDeep } from "lodash";
import React from "react"
import QueryCreate from "../../grapql/document/create";
import GetQuery from "../../grapql/document/get";
import { IFileView } from "./inlinebar";

interface IAddInput {
    classes: any,
    client: any,
    ctx: any,
    setFileView: React.Dispatch<React.SetStateAction<IFileView[] | undefined>>,
    setAddFile: React.Dispatch<React.SetStateAction<boolean>>,
    contextPosition?: {
        x: number;
        y: number;
        target: string;
        path: string;
    },
    fileView: IFileView[] | undefined
}

export default function AddInput(props: IAddInput) {
    const [tmpFileName, setTmpFileName] = React.useState<string>("");

    return <div className={props.classes.fileRow} style={{ paddingLeft: "16px" }}>
        <input placeholder={"untitled"}
            autoFocus
            onBlur={(e) => {
                props.setAddFile(false)
                if (e.target.value === "") return;
                if (props.contextPosition !== undefined) {
                    if (props.fileView?.find((v) => v.path === `${props.contextPosition.path}/${e.target.value}`)) {
                        return;
                    }
                } else {
                    if (props.fileView?.find((v) => v.path === `/${e.target.value}`)) {
                        return;
                    }
                }

                setTmpFileName(e.target.value)
                if (props.contextPosition !== undefined) {
                    props.client.mutate({
                        mutation: QueryCreate(`${props.contextPosition.path}/${e.target.value}`, props.ctx.session.userName, ""),
                    });
                } else {
                    props.client.mutate({
                        mutation: QueryCreate(`/${e.target.value}`, props.ctx.session.userName, ""),
                    });
                }
                props.client
                    .query({
                        query: GetQuery(),
                        fetchPolicy: "network-only",
                    })
                    .then((res: any) => {
                        let tmpResult = [];
                        for (let i of res.data.getDocument) {
                            let node = props.fileView?.find((v) => v.documentId === i.documentId)
                            if (node !== undefined) {
                                if (node.open) {
                                    let tmpNode = cloneDeep(node);
                                    tmpNode.content = i.content;
                                    tmpNode.path = i.path;
                                    tmpResult.push(tmpNode)
                                } else {
                                    if (props.contextPosition !== undefined && props.contextPosition.target === node.documentId) {
                                        let tmpNode = cloneDeep(node);
                                        tmpNode.content = i.content;
                                        tmpNode.path = i.path;
                                        tmpNode.open = true;
                                        tmpResult.push(tmpNode)
                                    } else {
                                        tmpResult.push(i)
                                    }
                                }
                            } else {
                                tmpResult.push(i)
                            }
                        }
                        props.setFileView(tmpResult);
                    });
            }}
            onKeyDown={(e: any) => {
                if (e.code === "Enter") {
                    props.setAddFile(false);
                    if (e.target.value === "") return;
                    if (props.contextPosition !== undefined) {
                        if (props.fileView?.find((v) => v.path === `${props.contextPosition.path}/${e.target.value}`)) {
                            return;
                        }
                    } else {
                        if (props.fileView?.find((v) => v.path === `/${e.target.value}`)) {
                            return;
                        }
                    }

                    setTmpFileName(e.target.value)
                    if (props.contextPosition !== undefined) {
                        props.client.mutate({
                            mutation: QueryCreate(`${props.contextPosition.path}/${e.target.value}`, props.ctx.session.userName, ""),
                        });
                    } else {
                        props.client.mutate({
                            mutation: QueryCreate(`/${e.target.value}`, props.ctx.session.userName, ""),
                        });
                    }
                    props.client
                        .query({
                            query: GetQuery(),
                            fetchPolicy: "network-only",
                        })
                        .then((res: any) => {
                            let tmpResult = [];
                            for (let i of res.data.getDocument) {
                                let node = props.fileView?.find((v) => v.documentId === i.documentId)
                                if (node !== undefined) {
                                    if (node.open) {
                                        let tmpNode = cloneDeep(node);
                                        tmpNode.content = i.content;
                                        tmpNode.path = i.path;
                                        tmpResult.push(tmpNode)
                                    } else {
                                        if (props.contextPosition !== undefined && props.contextPosition.target === node.documentId) {
                                            let tmpNode = cloneDeep(node);
                                            tmpNode.content = i.content;
                                            tmpNode.path = i.path;
                                            tmpNode.open = true;
                                            tmpResult.push(tmpNode)
                                        } else {
                                            tmpResult.push(i)
                                        }
                                    }
                                } else {
                                    tmpResult.push(i)
                                }
                            }
                            props.setFileView(tmpResult);
                        });

                }
            }}
        />
        <IconButton
            style={{ position: "absolute", right: 0, padding: 0, height: "30px", paddingRight: "12px" }}
            onClick={(e) => {
                e.stopPropagation();
                props.setAddFile(false)
            }}>
            <Delete className={props.classes.buttonColor} />
        </IconButton>
    </div>
}