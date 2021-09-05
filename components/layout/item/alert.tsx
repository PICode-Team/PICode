import { IconButton } from "@material-ui/core";
import { Cancel, Clear } from "@material-ui/icons";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import React from "react";
import { alertDialogStyle } from "../../../styles/layout/item/alert";

export default function AlertDialog(props: any) {
  const classes = alertDialogStyle();
  return (
    <div className={classes.content}>
      <div className={classes.header}>Recent Alarm</div>
      <div className={classes.alarmContent}>
        {props.data !== undefined &&
          props.data.map((v: any, i: number) => {
            return (
              <div
                key={`alarm-${i}`}
                style={{
                  color: "#ffffff",
                  padding: "6px 14px",
                  backgroundColor: "#505965",
                  display: "flex",
                  fontSize: "12px",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        marginRight: "6px",
                      }}
                    ></div>
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: "bold" }}
                    >{`${v.userId}'s ${v.type}`}</div>
                    <div>{v.content}</div>
                  </div>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(e: any) => {}}
                >
                  <Clear
                    style={{
                      width: "18px",
                      height: "18px",
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
      <div style={{ width: "100%", height: "20px" }}></div>
    </div>
  );
}
