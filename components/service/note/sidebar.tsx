import React from "react";
import { IFileView, INoteContent } from "./inlinebar";
import DescriptionIcon from "@material-ui/icons/Description";
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { cloneDeep } from "lodash";
import AddInput from "./addfile";
import QueryUpdate from "../../grapql/document/update";
import GetQuery from "../../grapql/document/get";

interface INoteSidebar {
  fileView: IFileView[] | undefined;
  setFileView: React.Dispatch<React.SetStateAction<IFileView[] | undefined>>;
  classes: any;
  setTest: React.Dispatch<React.SetStateAction<INoteContent[]>>
  setAddFile: React.Dispatch<React.SetStateAction<boolean>>
  addFile: boolean,
  setSelectFile: React.Dispatch<React.SetStateAction<IFileView | undefined>>
  setOpenContext: React.Dispatch<React.SetStateAction<boolean>>
  setContextPosition: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
    target: string;
    path: string;
  }>>
  selectFile: IFileView | undefined
  contextPosition: {
    x: number;
    y: number;
    target: string;
    path: string;
  },
  ctx: any,
  client: any
}

const findNode = (data: IFileView[] | undefined, documentId: string) => {
  if (data === undefined) return;
  for (let i of data) {
    if (i.documentId === documentId) {
      if (i.open) {
        i.open = false;
      } else {
        i.open = true;
      }
    }
  }
};

export default function NoteSidebar(props: INoteSidebar) {
  if (props.fileView === undefined) return <></>;
  if (props.ctx.ws === false) return <></>
  const output: any = {}
  const pushToOutput = (path: any, obj: any, value: any): any => {
    const clone = { ...value }
    const key = path[0];
    if (obj[key] === undefined) {
      obj[key] = clone
      obj[key].children = {};
    }
    path.shift()
    if (path.length > 0) {
      return pushToOutput(path, obj[key].children, clone)
    }
    obj[key] = clone

  }

  props.fileView.forEach((value: any) => {
    let path = value.path.split("/");
    path.splice(0, 1)
    pushToOutput(path, output, value)
  })

  const makeFileView = (output: any, num: number): any => {
    return <>{Object.keys(output).map((v: any, idx: any) => {
      return <>
        <div
          className={props.classes.fileRow}
          draggable={true}
          key={idx}
          id={output[v].documentId}
          onDragOver={(e) => {
            let node = document.getElementById(`${output[v].documentId}`);
            if (node) {
              node.style.border = "1px solid #fff";
            }
          }}
          onDragLeave={(e) => {
            let node = document.getElementById(`${output[v].documentId}`);
            if (node) {
              node.style.border = "0px";
            }
          }}
          onDragEnd={(e) => {
            if (props.fileView === undefined) return;
            let dragEndNode: any;
            for (let i of props.fileView) {
              let node = document.getElementById(`${i.documentId}`)
              if (node !== null &&
                node.getBoundingClientRect().top < e.clientY &&
                node.getBoundingClientRect().bottom > e.clientY) {
                dragEndNode = i;
                break;
              }
            }
            if (dragEndNode === undefined) return;
            let nodeGroup = props.fileView.filter((check) => {
              return check.path.includes(output[v].path)
            })
            for (let i of nodeGroup) {
              let name = i.path.split("/")
              props.ctx.ws.current.send(JSON.stringify({
                category: "document",
                type: "updateDocument",
                data: {
                  documentId: i.documentId,
                  document: {
                    path: dragEndNode.path + "/" + name[name.length - 1]
                  }
                }
              }))
              props.ctx.ws.current.send(JSON.stringify({
                category: "document",
                type: "getDocument",
                data: {
                  userId: props.ctx.session.userId,
                }
              }))
            }
          }}
          style={{ paddingLeft: `${16 * num}px` }}
          onClick={(e) => {
            if (Object.keys(output[v].children).length !== 0) {
              let tmpFileView = cloneDeep(props.fileView)
              findNode(tmpFileView, output[v].documentId);
              props.setFileView(tmpFileView);
            }
            e.stopPropagation();
            let tmpFile = {
              title: v,
              creator: output[v].creator,
              createTime: output[v].createTime,
              documentId: output[v].documentId,
              path: output[v].path
            }
            props.setSelectFile(tmpFile);
            if (output[v].content) {
              props.setTest(output[v].content);
            } else {
              props.setTest([]);
            }

          }}
          onContextMenu={(e) => {
            e.preventDefault();
            props.setOpenContext(true)
            props.setContextPosition({
              x: e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 4,
              y: e.currentTarget.getBoundingClientRect().top - 35,
              target: output[v].documentId,
              path: output[v].path
            })
          }}
        >
          {Object.keys(output[v].children).length > 0 &&
            <ExpandMoreRoundedIcon
              style={{
                height: "30px",
                transition: "all 0.3s",
                transform: `${(output[v].open === undefined || !output[v].open) ? "rotate(-90deg)" : "rotate(0deg)"}`
              }}
            />}
          <DescriptionIcon style={{ height: "30px", marginLeft: `${Object.keys(output[v].children).length > 0 ? 0 : "5px"}` }} />
          <div style={{ display: "flex", paddingLeft: "10px", lineHeight: "30px" }}>{v}</div>
        </div>
        {output[v].open !== undefined && output[v].open && makeFileView(output[v].children, num + 1)}
        {props.addFile && props.contextPosition.target === output[v].documentId &&
          <AddInput
            classes={props.classes}
            client={props.client}
            ctx={props.ctx}
            setFileView={props.setFileView}
            setAddFile={props.setAddFile}
            contextPosition={props.contextPosition}
            fileView={props.fileView}
          />}
      </>
    })}</>
  }

  return <>{makeFileView(output, 1)}
    {props.addFile && props.contextPosition.target === "" &&
      <AddInput
        classes={props.classes}
        client={props.client}
        ctx={props.ctx}
        setFileView={props.setFileView}
        setAddFile={props.setAddFile}
        fileView={props.fileView}
      />}
  </>
}