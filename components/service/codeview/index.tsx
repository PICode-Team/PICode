import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export default function CodeView() {
    const classes = recentWorkStyle();
    return <div style={{ width: "100%", height: "100%", padding: "32px" }}>
        <div className={classes.title}>
            Project List
        </div>
        <div className={classes.content}>

        </div>
    </div>
}