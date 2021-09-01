import { Delete } from "@material-ui/icons";
import React from "react"
import QueryDelete from "../../grapql/document/delete";
import AddIcon from "@material-ui/icons/Add";
import GetQuery from "../../grapql/document/get";
import { IFileView } from "./inlinebar";

interface IContextData { x: number, y: number, target: string, path: string }

interface INoteContextProps {
    classes: any,
    contextPosition: IContextData,
    client: any,
    setOpenContext: React.Dispatch<React.SetStateAction<boolean>>,
    setFileView: React.Dispatch<React.SetStateAction<IFileView[] | undefined>>,
    setSelectFile: React.Dispatch<React.SetStateAction<IFileView | undefined>>,
    fileView: IFileView[] | undefined,
    setAddFile: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function NoteContext({
    classes,
    contextPosition,
    client,
    setOpenContext,
    setFileView,
    setSelectFile,
    fileView,
    setAddFile }: INoteContextProps) {
    return <div
        onClick={(e) => {
            e.stopPropagation();
            e.preventDefault()
        }}
        onContextMenu={(e) => e.preventDefault()}
        className={classes.contextWrapper}
        style={{
            left: contextPosition.x,
            top: contextPosition.y,
        }}
    >
        <div
            className={classes.contextRow}
            onClick={() => {
                setAddFile(true)
                setOpenContext(false)
            }}
        >
            <span>New File</span> <AddIcon style={{ height: "20px" }} />
        </div>
        <div
            className={classes.contextRow}
            onClick={(e) => {
                e.stopPropagation();
                setOpenContext(false)
                if (fileView === undefined) return;
                let node = fileView.find((v) => v.documentId === contextPosition.target)
                if (node !== undefined) {
                    for (let i of fileView) {
                        if (i.path.includes(node.path)) {
                            client.mutate({
                                mutation: QueryDelete(i.documentId),
                            });
                        }
                    }
                }
                client
                    .query({
                        query: GetQuery(),
                        fetchPolicy: "network-only",
                    })
                    .then((res: any) => {
                        setFileView(res.data.getDocument);
                    });
                setSelectFile(undefined)
            }}
        >
            <span>Delete</span> <Delete style={{ height: "20px" }} />
        </div>
    </div >
}