import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork"

export default function IssueView() {
    const classes = recentWorkStyle();
    return <div style={{ width: "44%", height: "100%", }}>
        <div className={classes.title}>
            Server Stat
        </div>
        <div className={classes.content}>

        </div>
    </div>
}