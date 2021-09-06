import { IconButton } from "@material-ui/core";
import { Cancel, Clear } from "@material-ui/icons";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import React, { useEffect, useState } from "react";
import { alertDialogStyle } from "../../../styles/layout/item/alert";

export default function AlertDialog(props: any) {
  const classes = alertDialogStyle();

  const checkAlarm = (alarmId: string, alarmRoom: string) => {
    if (
      props.ctx.ws !== null &&
      props.ctx.ws.current !== null &&
      props.ctx.ws.current!.readyState === WebSocket.OPEN
    ) {
      props.ctx.ws.current.send(
        JSON.stringify({
          category: "alarm",
          type: "checkAlarm",
          data: {
            alarmId: alarmId,
            alarmRoom: alarmRoom,
          },
        })
      );
    }
  };

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
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                  onClick={() => {
                    window.location.href = v.location;
                    checkAlarm(v.alarmId, v.alarmRoom);
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
                    <div
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      {v.content}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 999,
                  }}
                  onClick={(e: any) => {
                    checkAlarm(v.alarmId, v.alarmRoom);
                  }}
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
