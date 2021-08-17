import React from "react"
import NoteView from "./noteview"
import RecentWork from "./recentwork"
import ServerStatView from "./serverstat"

export default function Dashboard() {
    return <>
        <div style={{ width: "100%", height: "100%" }}>
            <RecentWork />
            <div style={{ width: "100%", height: "40%", display: "flex", padding: "32px" }}>
                <NoteView />
                <ServerStatView />
            </div>
        </div>
    </>
}