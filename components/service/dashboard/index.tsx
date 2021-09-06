import React from "react"
import NoteView from "./noteview"
import RecentWork from "./recentwork"
import MilestoneView from "./milestoneview"
import IssueView from "./issueview"

export default function Dashboard() {
    return <>
        <div style={{ width: "100%", height: "100%" }}>
            <RecentWork />
            <div style={{ width: "100%", height: "40%", display: "flex", padding: "0 20px", paddingBottom: "20px", gap: "20px" }}>
                <IssueView />
                <MilestoneView />
                <NoteView />
            </div>
        </div>
    </>
}