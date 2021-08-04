import React from "react";
import { IFileView, INoteContent } from "./inlinebar";

interface INoteSidebar {
    fileView: IFileView[] | undefined;
    setFileView: React.Dispatch<React.SetStateAction<IFileView[] | undefined>>;
    classes: any;
    setTest: React.Dispatch<React.SetStateAction<INoteContent[]>>
    setAddFile: React.Dispatch<React.SetStateAction<boolean>>
    addFile: boolean,
    setSelectFile: React.Dispatch<React.SetStateAction<IFileView | undefined>>
    setOpenContext: React.Dispatch<React.SetStateAction<boolean>>
    setContextPosition: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
        target: string;
        path: string;
    }>>
}

export default function NoteSidebar(props: INoteSidebar) {
    console.log(props)
    return <></>
}