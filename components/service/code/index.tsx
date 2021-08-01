import React, { useEffect, useRef, useState } from "react";
import { codeStyle } from "../../../styles/service/code/code";
import { Sidebar } from "./sidebar";
import { CombinedEditor } from "./combinedEdtior";
import { TCode, TEditorRoot } from "./types";
import { useCode } from "../../../hooks/code";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { useDrag } from "../../../hooks/drag";
import {
  addCode,
  findCurrentFocus,
  getExtension,
  getLanguage,
  getTabInCode,
  insertCodeContent,
  reorderFileStructure,
} from "./functions";

function buildCodeLayout(
  codeList: TCode[],
  classes: ClassNameMap<"content" | "row" | "column" | "root">,
  projectName: string,
  getCode: (projectName: string, filePath: string) => void,
  changeCode: (projectName: string, filePath: string, code: string) => void
): JSX.Element {
  if (codeList.length === 0) return <React.Fragment></React.Fragment>;

  return (
    <React.Fragment>
      {codeList.map((v: TCode, i: number) => {
        return (
          <div
            className={v.vertical ? classes.column : classes.row}
            key={`Code-Wrapper-${v.codeId}`}
          >
            <div className={!v.vertical ? classes.column : classes.row}>
              <CombinedEditor
                tabList={v.tabList}
                tabOrderStack={v.tabOrderStack}
                codeId={v.codeId}
                focus={v.focus}
                projectName={projectName}
                getCode={getCode}
                changeCode={changeCode}
              />
            </div>
            {v.children.length !== 0 &&
              buildCodeLayout(
                v.children ?? [],
                classes,
                projectName,
                getCode,
                changeCode
              )}
          </div>
        );
      })}
    </React.Fragment>
  );
}

function EditorWrapper({
  codeRoot,
  getCode,
  changeCode,
  projectName,
}: {
  codeRoot: TEditorRoot | undefined;
  projectName: string;
  getCode: (projectName: string, filePath: string) => void;
  changeCode: (projectName: string, filePath: string, code: string) => void;
}) {
  const classes = codeStyle();
  const { drag } = useDrag();
  const { code, setCode } = useCode();

  if (codeRoot === undefined || codeRoot?.root.length === 0) {
    return (
      <div
        className={`${classes.emptyCode} ${
          drag.path !== "default" && classes.wrapperDrag
        }`}
        onDragEnter={(event: React.DragEvent<HTMLElement>) => {
          event.currentTarget.classList.add(classes.drag);
        }}
        onDragLeave={(event: React.DragEvent<HTMLElement>) => {
          event.currentTarget.classList.remove(classes.drag);
        }}
        onDragOver={(event: React.DragEvent<HTMLElement>) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        onDrop={(event: React.DragEvent<HTMLElement>) => {
          setCode({
            ...code,
            root: addCode(
              code.root,
              -1,
              {
                children: [],
                codeId: code.codeCount,
                focus: true,
                tabList: [
                  {
                    path: drag.path,
                    extension: getExtension(drag.path),
                    langauge: getLanguage(getExtension(drag.path)),
                    tabId: code.tabCount,
                    content: "",
                  },
                ],
                tabOrderStack: [code.tabCount],
                vertical: true,
              },
              false,
              true
            ),
            tabCount: code.tabCount + 1,
            codeCount: code.codeCount + 1,
            codeOrderStack: [code.codeCount],
          });
        }}
      >
        <div>drag-and-drop the file from the sidebar or click file.</div>
      </div>
    );
  }

  return (
    <div className={codeRoot?.vertical ? classes.column : classes.row}>
      {buildCodeLayout(
        codeRoot?.root ?? [],
        classes,
        projectName,
        getCode,
        changeCode
      )}
    </div>
  );
}

interface TFile {
  path: string;
  children?: TFile[] | undefined;
}

export default function Code(ctx: any): JSX.Element {
  const classes = codeStyle();
  const [codeRoot, setCodeRoot] = useState<TEditorRoot | undefined>(undefined);
  const { code, setCode } = useCode();
  const { drag, setDragInfo, deleteDragInfo } = useDrag();
  const [fileStructure, setFileStructure] = useState<TFile>({
    path: "none",
    children: undefined,
  });
  const [projectName, setProjectName] = useState<string>("");
  function loadProject(projectName: string) {
    console.log(ctx.ws.current.readyState);

    if (ctx.ws.current && ctx.ws.current.readyState === WebSocket.OPEN) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "loadProject",
          data: {
            projectName: projectName,
          },
        })
      );
    }
  }

  function getCode(projectName: string, filePath: string): void {
    if (ctx.ws.current && ctx.ws.current.OPEN) {
      setTimeout(() => {
        ctx.ws.current!.send(
          JSON.stringify({
            category: "code",
            type: "getCode",
            data: {
              projectName: projectName,
              filePath: filePath,
            },
          })
        );
      }, 1000);
    }
  }

  function changeCode(projectName: string, filePath: string, newCode: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "changeCode",
          data: {
            projectName: projectName,
            filePath: filePath,
            code: newCode,
          },
        })
      );
    }
  }

  function moveFileOrDir(
    projectName: string,
    oldPath: string,
    newPath: string
  ) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "moveFileOrDir",
          data: {
            projectName: projectName,
            oldPath: oldPath,
            newPath: newPath,
          },
        })
      );
    }
  }

  function createDir(projectName: string, dirPath: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "createDir",
          data: {
            projectName: projectName,
            dirPath: dirPath,
          },
        })
      );
    }
  }

  function createFile(projectName: string, filePath: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "createFile",
          data: {
            projectName: projectName,
            filePath: filePath,
          },
        })
      );
    }
  }

  function deleteFileOrDir(projectName: string, deletePath: string) {
    if (ctx.ws.current) {
      ctx.ws.current.send(
        JSON.stringify({
          category: "code",
          type: "deleteFileOrDir",
          data: {
            projectName: projectName,
            deletePath: deletePath,
          },
        })
      );
    }
  }

  useEffect(() => {
    if (ctx.ws === null) return;
    setProjectName(window?.location.href.split("?projectName=")[1] ?? "");

    console.log(ctx.ws);

    if (ctx.ws.current) {
      loadProject(window?.location.href.split("?projectName=")[1]);

      ctx.ws.current.addEventListener("message", (msg: any) => {
        const message = JSON.parse(msg.data);

        console.log(message);

        if (message.category === "code") {
          switch (message.type) {
            case "loadProject":
              // setFileStructure(reorderFileStructure(message.data));
              break;
            case "getCode":
              // setCode({
              //   ...code,
              //   root: insertCodeContent(
              //     code.root,
              //     message.data.filePath,
              //     message.data.fileContent
              //   ),
              // });
              break;
            case "changeCode":
              break;
            case "moveFileOrDir":
            case "createDir":
            case "createFile":
            case "deleteFileOrDir":
              loadProject(window?.location.href.split("?projectName=")[1]);
              break;
            default:
              break;
          }
        }
      });
    }
  }, [ctx.ws.current]);

  useEffect(() => {
    if (ctx.ws === null) return;
    if (ctx.ws.current) {
      if (fileStructure.path === "none")
        loadProject(window?.location.href.split("?projectName=")[1]);

      ctx.ws.current.addEventListener("message", (msg: any) => {
        const message = JSON.parse(msg.data);

        console.log(message);

        if (message.category === "code") {
          switch (message.type) {
            case "loadProject":
              // setFileStructure(reorderFileStructure(message.data));
              break;
            case "getCode":
              // setCode({
              //   ...code,
              //   root: insertCodeContent(
              //     code.root,
              //     message.data.filePath,
              //     message.data.fileContent
              //   ),
              // });
              break;
            case "changeCode":
              break;
            case "moveFileOrDir":
            case "createDir":
            case "createFile":
            case "deleteFileOrDir":
              loadProject(window?.location.href.split("?projectName=")[1]);
              break;
            default:
              break;
          }
        }
      });
    }
  }, [code]);

  function ctrlSEvent(event: KeyboardEvent) {
    if (
      event.key.toLowerCase() === "s" &&
      (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)
    ) {
      event.preventDefault();
      event.stopPropagation();
      const focusCodeId = findCurrentFocus(code.codeOrderStack);
      const targetTab = getTabInCode(code.root, focusCodeId);

      if (targetTab)
        changeCode(
          window.location.href.split("?projectName=")[1],
          targetTab?.path,
          targetTab?.content
        );
    }
  }

  useEffect(() => {
    return () => {
      if (ctx.ws.current) {
        ctx.ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", ctrlSEvent);
    setCodeRoot(code);
    return () => {
      window.removeEventListener("keydown", ctrlSEvent);
    };
  }, [code]);

  useEffect(() => {
    //    console.log(fileStructure);
  }, [fileStructure]);

  return ctx.ws === null ? (
    <React.Fragment></React.Fragment>
  ) : (
    <div className={classes.root}>
      <Sidebar
        fileStructure={fileStructure}
        projectName={projectName}
        code={code}
        drag={drag}
        functions={{
          moveFileOrDir: moveFileOrDir,
          createDir: createDir,
          createFile: createFile,
          deleteFileOrDir: deleteFileOrDir,
          setCode: setCode,
          setDragInfo: setDragInfo,
          deleteDragInfo: deleteDragInfo,
          setFileStructure: setFileStructure,
        }}
      />
      <div className={classes.content} id="content">
        <EditorWrapper
          codeRoot={codeRoot}
          projectName={projectName}
          getCode={getCode}
          changeCode={changeCode}
        />
      </div>
    </div>
  );
}
