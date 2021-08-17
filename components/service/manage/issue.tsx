import React, { useEffect, useState } from "react";
import { issueStyle } from "../../../styles/service/manage/issue";
import MakeIssue from "./makeissue";

export default function Issue({ ctx, setCreate, kanbanId }: any) {
    const classes = issueStyle();
    const [view, setView] = useState<string>("table");
    const [open, setOpen] = useState<boolean>(false);

    return <>
        <div className={classes.header}>
            <div style={{ display: "inline-block", padding: "0 10px" }}>
                Filter
            </div>
            <input placeholder="Search your project" />
            <div style={{ display: "inline-block", padding: "0 20px" }}>
                <div style={{ display: "inline-block", padding: "0 10px" }}>Label</div>
                <div style={{ display: "inline-block", padding: "0 10px" }}>Milestones</div>
            </div>
            <div style={{ display: "inline-block", padding: "0 20px", cursor: "pointer" }}
                className={classes.createButton}
                onClick={() => {
                    setOpen(true)
                }}
            >
                New Issue
            </div>
        </div>
        <div className={classes.content}>

        </div>
        <MakeIssue open={open} ws={ctx.ws.current} setOpen={setOpen} kanban={kanbanId} />
    </>
}