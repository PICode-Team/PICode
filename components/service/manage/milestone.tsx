import React from "react";
import { boardStyle } from "../../../styles/service/manage/board";
import CreateIcon from '@material-ui/icons/Create';
import MakeKanban from "./create/makeboard";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import MakeMile from "./create/makemile";

export default function Milestone({ ctx, setCreate, milestone }: any) {
    const classes = boardStyle();
    const [open, setOpen] = React.useState(false);
    const [kanbanIssue, setKanbanIssue] = React.useState<string>("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return <div className={classes.wrapper}>
        {kanbanIssue === "" && <>
            <div className={classes.header}>
                <div className={classes.createButton} onClick={() => {
                    setOpen(true)
                }}>
                    Create Milestone <CreateIcon style={{ marginLeft: "10px" }} />
                </div>
            </div>
            <div className={classes.content} id="kanbanBoard">
                <div style={{ width: "100%", height: "40px", fontSize: "16px", lineHeight: "40px", textAlign: "center", borderBottom: "1px solid #fff" }}>
                    <div style={{ padding: "0 30px" }}>
                        <div style={{ width: "100px", display: "inline-block", textAlign: "left" }}>
                            Name
                        </div>
                        <div style={{ width: "155px", display: "inline-block" }}>
                            Start Date
                        </div>
                        <div style={{ width: "155px", display: "inline-block" }}>
                            End Date
                        </div>
                        <div style={{ width: "calc(100% - 470px)", display: "inline-block" }}>
                            Content
                        </div>
                        <div style={{ width: "60px", display: "inline-block" }}>
                            Action
                        </div>
                    </div>
                </div>
                {milestone !== undefined && milestone.map((v: any, idx: number) => {
                    console.log(milestone)
                    return <div className={classes.kanbanItem} key={v.uuid} onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKanbanIssue(v.uuid);
                    }}>
                        <div className={classes.kanbanItemContent}>
                            <div style={{
                                fontSize: "15px",
                                lineHeight: "50px",
                                height: "50px",
                                position: "relative",
                                paddingLeft: "30px",
                                display: "inline-block",
                            }}>
                                <div style={{ width: "100px", display: "inline-block", textAlign: "left" }}>
                                    {v.title}
                                </div>
                                <div style={{ width: "155px", display: "inline-block" }}>
                                    {v.startDate}
                                </div>
                                <div style={{ width: "155px", display: "inline-block" }}>
                                    {v.endDate}
                                </div>
                                <div style={{ width: "calc(100% - 470px)", display: "inline-block" }}>
                                    {v.content}
                                </div>
                            </div>
                            <div style={{
                                float: "right",
                                fontSize: "12px",
                                height: "50px",
                                marginRight: "30px",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}>
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
                                        ctx.ws.current.send(JSON.stringify({
                                            category: "milestone",
                                            type: "deleteMilestone",
                                            data: {
                                                uuid: v.uuid
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
                })}
            </div>
            <MakeMile open={open} setOpen={setOpen} ws={ctx.ws.current} />
        </>
        }
    </div >
}