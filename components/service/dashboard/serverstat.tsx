import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork"

export default function ServerStatView() {
    const classes = recentWorkStyle();
    return <div style={{ width: "50%", height: "100%", padding: "0 0 0 16px" }}>
        <div className={classes.title}>
            Server Stat
        </div>
        <div className={classes.content}>

        </div>
    </div>
}