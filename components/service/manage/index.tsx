/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import { manageStyle } from "../../../styles/service/manage";
import Board from "./board";
import Milestone from "./milestone";

export default function Manage(ctx: any) {
    const classes = manageStyle();
    const router = useRouter();
    const manageMenu = ["Board", "Milestone"]
    const [menu, setMenu] = React.useState<string>("Board");
    const [create, setCreate] = React.useState<boolean>(false);
    const [kanban, setKanban] = React.useState<any[]>();
    const [milestone, setMilestone] = React.useState<any>();

    const makeContent = () => {
        switch (menu) {
            case "Board":
                return <Board ctx={ctx} setCreate={setCreate} kanban={kanban} />
            default:
                return <Milestone ctx={ctx} setCreate={setCreate} milestone={milestone} />
        }
    }

    React.useEffect(() => {
        if (ctx.ws.current) {
            ctx.ws.current.addEventListener("message", (msg: any) => {
                let content = JSON.parse(msg.data);
                if (content.category === "kanban") {
                    switch (content.type) {
                        case "getKanban":
                            setKanban(content.data.kanbans)
                            break;
                        default:
                    }
                } else if (content.category === "milestone") {
                    switch (content.type) {
                        case "getMilestone":
                            setMilestone(content.data)
                            break;
                        default:
                    }
                }
            })

            ctx.ws.current.send(
                JSON.stringify({
                    category: "kanban",
                    type: "getKanban",
                    data: {}
                })
            )

            ctx.ws.current.send(
                JSON.stringify({
                    category: "milestone",
                    type: "getMilestone",
                    data: {}
                })
            )

        }
    }, [ctx.ws])

    return <div style={{ width: "100%", height: "100%" }}>
        <div className={classes.title}>
            Project/{router.query.projectName} Manage
        </div>
        <div className={classes.content}>
            <div className={classes.projectContent}>
                <div className={classes.projectHeader}>
                    {manageMenu.map((v: string) => {
                        return <div className={clsx(classes.headerMenu, v === menu && classes.makeLine, v !== menu && classes.notSelect)}
                            onClick={() => {
                                setMenu(v)
                            }}
                            key={v}>
                            {v}
                        </div>
                    })}
                </div>
                <div className={classes.manageContent}>
                    {makeContent()}
                </div>
            </div>
        </div>
    </div >
}