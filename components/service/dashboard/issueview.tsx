import React, { useEffect, useState } from "react";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export default function IssueView(props: any) {
  const classes = recentWorkStyle();
  const [kanbanList, setKanbanList] = useState<string[]>([]);
  const [issues, setIssue] = useState<any[]>([]);

  useEffect(() => {
    if (props.ws !== undefined && props.ws.current) {
      props.ws.current.addEventListener("message", (msg: any) => {
        let content = JSON.parse(msg.data);
        if (content.category === "kanban") {
          switch (content.type) {
            case "getKanban":
              const kanbans: string[] = [];
              content.data.kanbans.forEach((v: any) => {
                kanbans.push(v.uuid);
              });
              setKanbanList(kanbans);
              break;
            default:
          }
        } else if (content.category === "issue") {
          switch (content.type) {
            case "getIssue":
              if (content.data.issues.length > 0)
                setIssue([...issues, ...content.data.issues]);
              break;
          }
        }
      });

      if (kanbanList.length === 0) {
        props.ws.current.send(
          JSON.stringify({
            category: "kanban",
            type: "getKanban",
            data: {},
          })
        );
      }
    }
  }, [props.ws]);

  useEffect(() => {
    if (props.ws !== undefined && props.ws.current) {
      kanbanList.map((v) => {
        props.ws.current.send(
          JSON.stringify({
            category: "issue",
            type: "getIssue",
            data: {
              kanbanUUID: v,
              options: {},
            },
          })
        );
      });
    }
  }, [kanbanList]);

  return (
    <div style={{ width: "44%", height: "100%" }}>
      <div className={classes.title}>Issue</div>
      <div
        className={classes.content}
        style={{
          display: "block",
          overflowY: "auto",
        }}
      >
        {issues.length > 0 ? (
          issues.map((v, i) => {
            return (
              <div
                key={`dashboard-issue-${i}`}
                className={classes.test}
                style={{
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  // console.log(v);
                  //window.location.href = `/manage/issue?projectName=${abc}&kanban=${testasd}`;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
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
                  <div style={{ width: "60px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: "11px" }}>#{v.issueId} Issue</div>
                  </div>
                  <div
                    style={{
                      height: "100%",
                      marginLeft: "12px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {v.content ?? "this issue has no content"}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex" }}>
                    {v.label !== "" && v.label !== undefined && (
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
                          color: "#ffffff",
                        }}
                      >
                        {v.label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>this server has no issue</div>
        )}
      </div>
    </div>
  );
}
