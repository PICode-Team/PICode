import React, { useEffect, useState } from "react";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export default function MilestoneView(props: any) {
  const classes = recentWorkStyle();
  const [milestone, setMile] = useState<any[]>([]);

  useEffect(() => {
    if (props.ws !== undefined && props.ws.current) {
      props.ws.current.addEventListener("message", (msg: any) => {
        let content = JSON.parse(msg.data);
        if (content.category === "milestone") {
          switch (content.type) {
            case "getMilestone":
              setMile(content.data);
              break;
            default:
          }
        }
      });

      if (milestone.length === 0) {
        props.ws.current.send(
          JSON.stringify({
            category: "milestone",
            type: "getMilestone",
            data: {},
          })
        );
      }
    }
  }, [props.ws]);

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
    <div style={{ width: "24%", height: "100%" }}>
      <div className={classes.title}>Milestone</div>
      <div
        className={classes.content}
        style={{
          display: "block",
          overflowY: "auto",
          padding: "15px",
        }}
      >
        {milestone.length > 0 ? (
          milestone.map((v: any, idx: number) => {
            return (
              <div
                className={classes.test}
                key={v.uuid}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                style={{
                  padding: "8px 12px 10px",
                  marginBottom: "12px",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2px",
                  }}
                >
                  <div style={{ fontSize: "16px" }}>{v.title}</div>
                  <div style={{ display: "flex", alignItems: "center" }}></div>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      backgroundColor: "#6d7681",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: `${getPercentage(v.startDate, v.endDate)}%`,
                        height: "6px",
                        backgroundColor: "#4078b8",
                        borderRadius: "6px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>this server has no milestone</div>
        )}
      </div>
    </div>
  );
}
