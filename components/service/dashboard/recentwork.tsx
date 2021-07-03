import React from "react"
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export default function RecentWork() {
    const classes = recentWorkStyle();
    return <div className={classes.recentContent}>
        <div className={classes.title}>
            Recent Work
        </div>
        <div className={classes.content}>test</div>
    </div>
}