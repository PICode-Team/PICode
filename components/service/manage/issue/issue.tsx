/* eslint-disable react-hooks/exhaustive-deps */
import { Switch } from "@material-ui/core";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { issueStyle } from "../../../../styles/service/manage/issue";
import MakeIssue from "../create/makeissue";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

export default function Issue(props: any) {
    const classes = issueStyle();
    const router = useRouter();
    const [view, setView] = useState<string>("table");
    const [open, setOpen] = useState<boolean>(false);
    const [col, setCol] = useState<string[]>();
    const [mile, setMile] = useState();
    const [issue, setIssue] = useState<any[]>();
    const [kanban, setKanban] = useState<string>("");
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const [node, setNode] = React.useState();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };


    useEffect(() => {
        if (props.ws !== undefined && props.ws.current) {
            props.ws.current.addEventListener("message", (msg: any) => {
                let content = JSON.parse(msg.data);
                if (content.category === "kanban") {
                    switch (content.type) {
                        case "getKanban":
                            let node = content.data.kanbans.find((v: any) => v.title === router.query.kanban);
                            setKanban(node.uuid)
                            setCol(node.columns)
                            break;
                        default:
                    }
                } else if (content.category === "milestone") {
                    switch (content.type) {
                        case "getMilestone":
                            setMile(content.data)
                            break;
                        default:
                    }
                } else if (content.category === "issue") {
                    switch (content.type) {
                        case "getIssue":
                            setIssue(content.data.issues)
                            break;
                    }
                }
            })

            props.ws.current.send(
                JSON.stringify({
                    category: "kanban",
                    type: "getKanban",
                    data: {}
                })
            )

            props.ws.current.send(
                JSON.stringify({
                    category: "milestone",
                    type: "getMilestone",
                    data: {}
                })
            )

        }
    }, [props.ws])

    useEffect(() => {
        if (props.ws !== undefined && props.ws.current) {
            props.ws.current.send(
                JSON.stringify({
                    category: "issue",
                    type: "getIssue",
                    data: {
                        kanbanUUID: kanban,
                        options: {}
                    }
                })
            )
        }
    }, [kanban])

    return <>
        <div className={classes.wrapper}>
            <div className={classes.title}>
                {`${router.query!.projectName}/${router.query!.kanban} Board`}
            </div>
            <div className={classes.header}>
                <div style={{ display: "inline-block", padding: "0 10px" }}>
                    <Switch
                        checked={state.checkedA}
                        onChange={handleChange}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </div>
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
            {state.checkedA ?
                <div className={classes.content}>
                    <div style={{ width: "100%", height: "40px", fontSize: "16px", lineHeight: "40px", textAlign: "center", borderBottom: "1px solid #fff" }}>
                        <div style={{ width: "100px", display: "inline-block" }}>
                            issueId
                        </div>
                        <div style={{ width: "155px", display: "inline-block" }}>
                            Name
                        </div>
                        <div style={{ width: "155px", display: "inline-block" }}>
                            Assigner
                        </div>
                        <div style={{ width: "100px", display: "inline-block" }}>
                            Column
                        </div>
                        <div style={{ width: "calc(100% - 660px)", display: "inline-block" }}>
                            Content
                        </div>
                        <div style={{ width: "150px", display: "inline-block" }}>
                            Action
                        </div>
                    </div>
                    {
                        issue !== undefined && issue.map((v: any, idx: number) => {
                            return <div className={classes.mileItem} key={v.uuid} onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}>
                                <div className={classes.mileItemContent}>
                                    <div style={{ width: "100px", display: "inline-block" }}>
                                        {v.issueId}
                                    </div>
                                    <div style={{ width: "155px", display: "inline-block" }}>
                                        {v.title}
                                    </div>
                                    <div style={{ width: "155px", display: "inline-block" }}>
                                        {v.assigner}
                                    </div>
                                    <div style={{ width: "100px", display: "inline-block" }}>
                                        {v.column}
                                    </div>
                                    <div style={{ width: "calc(100% - 660px)", display: "inline-block" }}>
                                        {v.content}
                                    </div>
                                    <div style={{ width: "150px", display: "inline-block" }}>
                                        <EditIcon
                                            id={`editButton-${idx}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onMouseOver={(e) => {
                                                e.stopPropagation();
                                                let node = document.getElementById(`editButton-${idx}`);
                                                if (node) {
                                                    node.style.opacity = "1"
                                                }
                                            }}
                                            onMouseOut={() => {
                                                let node = document.getElementById(`editButton-${idx}`);
                                                if (node) {
                                                    node.style.opacity = "0.5"
                                                }
                                            }} style={{ width: "25px", height: "25px", marginRight: "10px", opacity: "0.5" }}
                                        />
                                        <DeleteForeverIcon
                                            id={`buttonhover-${idx}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (props.ws === undefined) return;
                                                props.ws.current.send(JSON.stringify({
                                                    category: "issue",
                                                    type: "deleteIssue",
                                                    data: {
                                                        kanbanUUID: kanban,
                                                        issueUUID: v.uuid
                                                    }
                                                }))
                                                window.location.reload();
                                            }}
                                            onMouseOver={(e) => {
                                                e.stopPropagation();
                                                let node = document.getElementById(`buttonhover-${idx}`);
                                                if (node) {
                                                    node.style.opacity = "1"
                                                }
                                            }}
                                            onMouseOut={() => {
                                                let node = document.getElementById(`buttonhover-${idx}`);
                                                if (node) {
                                                    node.style.opacity = "0.5"
                                                }
                                            }} style={{ width: "25px", height: "25px", opacity: "0.5" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
                : <div className={classes.content}>
                    <div style={{ width: "100%", height: "100%", padding: "0 20px", display: "flex" }}>
                        {col !== undefined && col.map((v: any) => {
                            return <div key={v} className={classes.columnWraper} id={v}>
                                <p style={{ marginTop: "-20px" }}>
                                    {v}
                                </p>
                                {issue !== undefined && issue.map((node: any) => {
                                    if (v === node.column) {
                                        return <div className={classes.columnItem} draggable
                                            onDragStart={(e) => {
                                                setNode(node)
                                            }}
                                            onDragEnd={(e) => {
                                                for (let i of col) {
                                                    let tmpCol = document.getElementById(i)?.getBoundingClientRect();
                                                    if (tmpCol!.left < e.clientX && tmpCol!.right > e.clientX) {
                                                        props.ws.current.send(
                                                            JSON.stringify({
                                                                category: "issue",
                                                                type: "updateIssue",
                                                                data: {
                                                                    kanbanUUID: kanban,
                                                                    issueData: {
                                                                        uuid: node.uuid,
                                                                        column: i
                                                                    }
                                                                }
                                                            })
                                                        )

                                                        props.ws.current.send(
                                                            JSON.stringify({
                                                                category: "issue",
                                                                type: "getIssue",
                                                                data: {
                                                                    kanbanUUID: kanban,
                                                                    options: {}
                                                                }
                                                            })
                                                        )
                                                    }
                                                }
                                            }}>
                                            {node.title}
                                        </div>
                                    }
                                })}
                            </div>
                        })}
                    </div>
                </div>}
            <MakeIssue open={open} ws={props.ws.current} setOpen={setOpen} kanban={kanban} />
        </div>
    </>
}