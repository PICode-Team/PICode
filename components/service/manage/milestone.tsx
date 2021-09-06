import React from "react";
import { boardStyle } from "../../../styles/service/manage/board";
import CreateIcon from "@material-ui/icons/Create";
import MakeKanban from "./create/makeboard";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import MakeMile from "./create/makemile";
import { DeleteForever, Edit } from "@material-ui/icons";

export default function Milestone({ ctx, setCreate, milestone }: any) {
  const classes = boardStyle();
  const [modal, setModal] = React.useState(false);
  const [kanbanIssue, setKanbanIssue] = React.useState<string>("");
  const [modalData, setModalData] = React.useState<any>({
    uuid: "",
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });

  function getPercentage(startData: string, endDate: string) {
    const date = new Date();
    const whole = Number(endDate.slice(8, 10)) - Number(startData.slice(8, 10));
    const today = Number(date.getDate()) - Number(startData.slice(8, 10));
    const percentage = today / whole;

    if (percentage < 0) {
      return 0;
    }

    return percentage * 100;
  }

  return (
    <div className={classes.wrapper}>
      {kanbanIssue === "" && (
        <>
          <div className={classes.content} id="kanbanBoard">
            {milestone !== undefined &&
              milestone.map((v: any, idx: number) => {
                return (
                  <div
                    className={classes.item}
                    key={v.uuid}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div style={{ fontSize: "16px" }}>{v.title}</div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          className={classes.icon}
                          onClick={(e) => {
                            e.stopPropagation();

                            setModalData({
                              uuid: v.uuid,
                              title: v.title,
                              content: v.content,
                              startDate: v.startDate,
                              endDate: v.endDate,
                            });
                            setModal(true);
                          }}
                        >
                          <Edit
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "4px",
                            }}
                          />
                        </div>
                        <div
                          className={classes.icon}
                          onClick={(e) => {
                            e.stopPropagation();
                            ctx.ws.current.send(
                              JSON.stringify({
                                category: "milestone",
                                type: "deleteMilestone",
                                data: {
                                  uuid: v.uuid,
                                },
                              })
                            );
                            window.location.reload();
                          }}
                        >
                          <DeleteForever
                            style={{ width: "20px", height: "20px" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          backgroundColor: "#6d7681",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: `${getPercentage(v.startDate, v.endDate)}%`,
                            height: "10px",
                            backgroundColor: "#4078b8",
                            borderRadius: "6px",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      {v.startDate} ~ {v.endDate}
                    </div>
                    <div>
                      {v.content ?? "this milestone is no have description."}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      {modal === true && (
        <MakeMile
          open={modal}
          setOpen={setModal}
          ws={ctx.ws.current}
          modalData={modalData}
          edit={true}
        />
      )}
    </div>
  );
}
