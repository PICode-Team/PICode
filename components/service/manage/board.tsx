import React from "react";
import { boardStyle } from "../../../styles/service/manage/board";
import CreateIcon from "@material-ui/icons/Create";
import MakeKanban from "./create/makeboard";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Issue from "./issue/issue";
import { useRouter } from "next/router";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteForever, Edit } from "@material-ui/icons";

export default function Board({ ctx, setCreate, kanban, setOpen, open }: any) {
  const classes = boardStyle();
  const router = useRouter();
  const [kanbanIssue, setKanbanIssue] = React.useState<string>("");
  const [modalData, setModalData] = React.useState<any>({
    title: "",
    description: "",
    milestone: "",
  });
  const [modal, setModal] = React.useState<boolean>(false);

  return (
    <div className={classes.wrapper}>
      {kanbanIssue === "" && (
        <>
          <div className={classes.content} id="kanbanBoard">
            {kanban !== undefined &&
              kanban.map((v: any, i: number) => {
                return (
                  <div
                    key={v.uuid}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.location.href =
                        router.route +
                        "/issue" +
                        router.asPath.split(router.route)[1] +
                        `&kanban=${v.title}`;
                    }}
                    className={classes.item}
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
                              title: v.title,
                              uuid: v.uuid,
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
                                category: "kanban",
                                type: "deleteKanban",
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
                            width: "0%",
                            height: "10px",
                            backgroundColor: "#4078b8",
                            borderRadius: "6px",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      {v.description ??
                        "this kanbanboard is no have description."}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      {modal === true && (
        <MakeKanban
          userId={ctx.session.userId}
          open={modal}
          setOpen={setModal}
          ws={ctx.ws.current}
          modalData={modalData}
          edit={true}
        />
      )}
      {kanbanIssue !== "" && <Issue ctx={ctx} kanbanId={kanbanIssue} />}
    </div>
  );
}
