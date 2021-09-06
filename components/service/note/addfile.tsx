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
    if (props.contextPosition === undefined) return <></>

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
                    props.ctx.ws.current.send(JSON.stringify({
                        category: "document",
                        type: "createDocument",
                        data: {

                            path: `${props.contextPosition.path}/${e.target.value}`,
                            creator: props.ctx.session.userName,
                            content: ""

                        }
                    }))
                } else {
                    props.ctx.ws.current.send(JSON.stringify({
                        category: "document",
                        type: "createDocument",
                        data: {

                            path: `/${e.target.value}`,
                            creator: props.ctx.session.userName,
                            content: ""

                        }
                    }))
                }
                props.ctx.ws.current.send(JSON.stringify({
                    category: "document",
                    type: "getDocument",
                    data: {
                        userId: props.ctx.session.userId,
                    }
                }))
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
                        props.ctx.ws.current.send(JSON.stringify({
                            category: "document",
                            type: "createDocument",
                            data: {

                                path: `${props.contextPosition.path}/${e.target.value}`,
                                creator: props.ctx.session.userName,
                                content: ""

                            }
                        }))
                    } else {
                        props.ctx.ws.current.send(JSON.stringify({
                            category: "document",
                            type: "createDocument",
                            data: {

                                path: `/${e.target.value}`,
                                creator: props.ctx.session.userName,
                                content: ""

                            }
                        }))
                    }
                    props.ctx.ws.current.send(JSON.stringify({
                        category: "document",
                        type: "getDocument",
                        data: {
                            userId: props.ctx.session.userId,
                        }
                    }))

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