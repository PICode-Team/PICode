import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork"

export default function MilestoneView() {
    const classes = recentWorkStyle();
    return <div style={{ width: "24%", height: "100%" }}>
        <div className={classes.title}>
            Milestone
        </div>
        <div className={classes.content}>

        </div>
    </div>
}