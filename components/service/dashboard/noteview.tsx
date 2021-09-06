import React, { useState, useEffect } from "react";
import { recentWorkStyle } from "../../../styles/service/dashboard/recentwork";

export interface INoteContent {
  text: string;
  content?: any; //table 이나 이미지 같은 거 넣을 때 사용할 듯
  type?: string;
  clicked?: boolean;
}

export interface IFileView {
  title: string;
  createTime: string;
  type?: string[];
  isFolder?: boolean;
  creator: string[];
  children?: IFileView[];
  content?: INoteContent[];
  open?: boolean;
  documentId: string;
  path: string;
}

export default function NoteView(props: any) {
  const classes = recentWorkStyle();
  const [fileView, setFileView] = React.useState<IFileView[]>();

  useEffect(() => {
    if (props.ws !== false) {
      props.ws.current.addEventListener("message", (msg: any) => {
        const message = JSON.parse(msg.data);
        if (message.category === "document") {
          switch (message.type) {
            case "getDocument":
              setFileView(message.data);
              break;
          }
        }
      });
      if (fileView === undefined) {
        props.ws.current.send(
          JSON.stringify({
            category: "document",
            type: "getDocument",
            data: {
              userId: props.session.userId,
            },
          })
        );
      }
    }
  }, [props.ws]);

  return (
    <div style={{ width: "32%", height: "100%" }}>
      <div className={classes.title}>Note</div>
      <div
        className={classes.content}
        style={{
          display: "block",
          overflowY: "auto",
        }}
      >
        {fileView !== undefined ? (
          fileView.map((v, i) => {
            const pathList = v.path.split("/");
            const fileName = pathList[pathList.length - 1];
            return (
              <div
                key={`dashboard-file-viwe-${i}`}
                className={classes.test}
                style={{
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span>{fileName} is created</span>
                </div>
                <div>
                  <span>{v.createTime}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div>this server has no document</div>
        )}
      </div>
    </div>
  );
}
