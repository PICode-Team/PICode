import React, { useEffect, useState } from "react";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export default function IssueView(props: any) {
  const classes = recentWorkStyle();
  const [kanbanList, setKanbanList] = useState<string[]>([]);
  const [mile, setMile] = useState();
  const [issue, setIssue] = useState<any[]>();

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
              setIssue([...(issue as any[]), content.data.issues]);
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
      <div className={classes.title}>Server Stat</div>
      <div className={classes.content}>
        {issue !== undefined &&
          issue.map((v, i) => {
            <div
              key={`issue-${i}`}
              style={{
                backgroundColor: "#2C3239",
                padding: "15px",
                borderRadius: "6px",
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
                  <div style={{ fontSize: "11px" }}>{v.title}</div>
                  <div style={{ fontSize: "11px" }}>#{v.issueId} Issue</div>
                </div>
              </div>
              <div style={{ fontSize: "11px", marginBottom: "14px" }}>
                {v.content}
              </div>
              <div style={{ display: "flex" }}>
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
                  {v.label}
                </div>
              </div>
            </div>;
          })}
      </div>
    </div>
  );
}
