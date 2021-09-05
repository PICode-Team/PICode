/* eslint-disable react-hooks/exhaustive-deps */
import { Switch } from "@material-ui/core";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { issueStyle } from "../../../../styles/service/manage/issue";
import MakeIssue from "../create/makeissue";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
import { Edit } from "@material-ui/icons";

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
  const [edit, setEdit] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>({
    title: "",
    assigner: "",
    content: "",
    milestone: "",
    label: "",
    uuid: "",
    column: "",
  });
  const [column, setColumn] = useState<string>("");

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
              let node = content.data.kanbans.find(
                (v: any) => v.title === router.query.kanban
              );
              setKanban(node.uuid);
              setCol(node.columns);
              break;
            default:
          }
        } else if (content.category === "milestone") {
          switch (content.type) {
            case "getMilestone":
              setMile(content.data);
              break;
            default:
          }
        } else if (content.category === "issue") {
          switch (content.type) {
            case "getIssue":
              setIssue(content.data.issues);
              break;
          }
        }
      });

      props.ws.current.send(
        JSON.stringify({
          category: "kanban",
          type: "getKanban",
          data: {},
        })
      );

      props.ws.current.send(
        JSON.stringify({
          category: "milestone",
          type: "getMilestone",
          data: {},
        })
      );
    }
  }, [props.ws]);

  useEffect(() => {
    if (props.ws !== undefined && props.ws.current) {
      props.ws.current.send(
        JSON.stringify({
          category: "issue",
          type: "getIssue",
          data: {
            kanbanUUID: kanban,
            options: {},
          },
        })
      );
    }
  }, [kanban]);

  let uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  function Col({ title }: { title: string }) {
    return (
      <div
        id={title}
        style={{ height: "100%", color: "#ffffff", width: "330px" }}
      >
        <div
          style={{
            backgroundColor: "#1D2228",
            height: "60px",
            padding: "15px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: "6px",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div
                style={{
                  fontSize: "18px",
                  marginRight: "8px",
                  fontWeight: "bold",
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: "13px" }}>
                last {(issue ?? []).filter((v) => title === v.column).length}{" "}
                issue
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  setColumn(title);
                  setOpen(true);
                }}
              >
                <Add style={{ width: "22px", height: "22px" }} />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#3B434D",
            height: "calc(100% - 60px)",
            padding: "15px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          {issue !== undefined &&
            issue.map((node: any) => {
              if (title === node.column) {
                return <Card key={`issue-item-${uuidv4()}`} node={node} />;
              }
            })}
        </div>
      </div>
    );
  }

  function Card({ node }: any) {
    console.log(node);

    return (
      <div
        style={{
          backgroundColor: "#2C3239",
          padding: "15px",
          borderRadius: "6px",
          height: "120px",
          marginBottom: "15px",
        }}
        draggable
        onDragStart={(e) => {
          setNode(node);
        }}
        onDragEnd={(e) => {
          for (let i of col!) {
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
                      column: i,
                    },
                  },
                })
              );

              props.ws.current.send(
                JSON.stringify({
                  category: "issue",
                  type: "getIssue",
                  data: {
                    kanbanUUID: kanban,
                    options: {},
                  },
                })
              );
            }
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              marginRight: "8px",
            }}
          ></div>
          <div>
            <div style={{ fontSize: "11px" }}>{node.title}</div>
            <div style={{ fontSize: "11px" }}>#{node.issueId} Issue</div>
          </div>
        </div>
        <div style={{ fontSize: "11px", marginBottom: "14px" }}>
          {node.content}
        </div>
        <div style={{ display: "flex" }}>
          {node.label !== undefined && (
            <div
              style={{
                fontSize: "10px",
                textAlign: "center",
                width: "50px",
                height: "18px",
                backgroundColor: "#475261",
                marginRight: "6px",
                borderRadius: "6px",
                padding: "3px 0px",
              }}
            >
              {node.label}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          {`${router.query!.projectName} / ${router.query!.kanban} Board`}
        </div>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 61px)",
            display: "flex",
            gap: "30px",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          {col !== undefined && col.map((v: any) => <Col key={v} title={v} />)}
        </div>
        <MakeIssue
          open={open}
          ws={props.ws.current}
          setOpen={setOpen}
          kanban={kanban}
          edit={edit}
          modalData={modalData}
          column={column}
          userId={props.session.userId}
        />
      </div>
    </>
  );
}
