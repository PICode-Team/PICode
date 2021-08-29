import React from "react";
import { boardStyle } from "../../../styles/service/manage/board";
import CreateIcon from '@material-ui/icons/Create';
import MakeKanban from "./create/makeboard";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Issue from "./issue/issue";
import { useRouter } from "next/router";
import EditIcon from '@material-ui/icons/Edit';

export default function Board({ ctx, setCreate, kanban }: any) {
    const classes = boardStyle();
    const router = useRouter();
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
                    Create Board <CreateIcon style={{ marginLeft: "10px" }} />
                </div>
            </div>
            <div className={classes.content} id="kanbanBoard">
                <div style={{ width: "100%", height: "40px", fontSize: "16px", lineHeight: "40px", textAlign: "center", borderBottom: "1px solid #fff" }}>
                    <div style={{ padding: "0 30px" }}>
                        <div style={{ width: "100px", display: "inline-block", textAlign: "left" }}>
                            Name
                        </div>
                        <div style={{ width: "155px", display: "inline-block" }}>
                            Progress of Issue
                        </div>
                        <div style={{ width: "calc(100% - 315px)", display: "inline-block" }}>
                            Content
                        </div>
                        <div style={{ width: "60px", display: "inline-block" }}>
                            Action
                        </div>
                    </div>
                </div>
                {kanban !== undefined && kanban.map((v: any, idx: number) => {
                    return <div className={classes.kanbanItem} key={v.uuid} onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.location.href = router.route + "/issue" + router.asPath.split(router.route)[1] + `&kanban=${v.title}`
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
                                <div style={{ display: "flex", height: "100%" }}>
                                    <div style={{ margin: 0, width: "100px", display: "inline-block", paddingRight: "20px" }}>
                                        {v.title}
                                    </div>
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                        <div style={{ width: "150px", height: "7px", marginLeft: "5px", background: "#fff", borderRadius: "3px" }}>
                                            <div style={{ width: `${v.totalIssue === 0 ? 100 : v.doneIssue / v.totalIssue * 100}%`, height: "7px", background: "black", borderRadius: "3px" }} />
                                        </div>
                                    </div>
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
                                            category: "kanban",
                                            type: "deleteKanban",
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
            <MakeKanban userId={ctx.session.userId} open={open} setOpen={setOpen} ws={ctx.ws.current} />
        </>
        }
        {kanbanIssue !== "" && <Issue ctx={ctx} kanbanId={kanbanIssue} />}
    </div >
}