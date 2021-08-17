import React from "react";
import { boardStyle } from "../../../styles/service/manage/board";
import CreateIcon from '@material-ui/icons/Create';
import MakeKanban from "./makeboard";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Issue from "./issue";

export default function Board({ ctx, setCreate, kanban }: any) {
    const classes = boardStyle();
    const [open, setOpen] = React.useState(false);
    const [kanbanIssue, setKanbanIssue] = React.useState<string>("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let tmpData = ["test", "Test1", "test2"]

    return <div className={classes.wrapper}>
        {kanbanIssue === "" && <>
            <div className={classes.header}>
                <div className={classes.createButton} onClick={() => {
                    setOpen(true)
                }}>
                    Create Board <CreateIcon style={{ marginLeft: "10px" }} />
                </div>
            </div>
            <div className={classes.content}>
                {kanban !== undefined && kanban.map((v: any) => {
                    return <div className={classes.kanbanItem} key={v.uuid} onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKanbanIssue(v.uuid);
                    }}>
                        <div className={classes.kanbanItemContent}>
                            <div style={{
                                fontSize: "24px",
                                lineHeight: "60px",
                                height: "60px",
                                paddingLeft: "30px",
                                display: "inline-block",
                            }}>
                                {v.title}
                            </div>
                            <div style={{
                                fontSize: "12px",
                                height: "60px",
                                paddingLeft: "30px",
                                display: "inline-block",
                            }}>
                                이슈 개수... (16 /30)
                            </div>
                            <div style={{
                                float: "right",
                                fontSize: "12px",
                                height: "60px",
                                paddingRight: "30px",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer"
                            }}
                                onClick={() => {
                                    ctx.ws.current.send(JSON.stringify({
                                        category: "kanban",
                                        type: "deleteKanban",
                                        data: {
                                            kanbanUUID: v.uuid
                                        }
                                    }))
                                    // window.location.reload();
                                }}
                            >
                                <DeleteForeverIcon style={{ width: "30px", height: "30px" }} />
                            </div>
                        </div>
                    </div>
                })}
            </div>
            <MakeKanban open={open} setOpen={setOpen} ws={ctx.ws.current} />
        </>}
        {kanbanIssue !== "" && <Issue ctx={ctx} kanbanId={kanbanIssue} />}
    </div>
}