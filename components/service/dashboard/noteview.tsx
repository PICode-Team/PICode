import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork"

export default function NoteView() {
    const classes = recentWorkStyle();
    return <div style={{ width: "50%", height: "100%" }}>
        <div className={classes.title}>
            Current Document
        </div>
        <div className={classes.content}>

        </div>
    </div>
}