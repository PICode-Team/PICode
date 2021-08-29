/* eslint-disable react-hooks/exhaustive-deps */
import { AddCircleRounded, ArrowForwardIos, List } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { TDragState } from "../../../../modules/drag";
import { sidebarStyle } from "../../../../styles/service/code/code";
import WebAssetIcon from '@material-ui/icons/WebAsset';
import {
  addCode,
  addCreateInput,
  addRenameField,
  addTab,
  checkSamePath,
  checkTabDuplicating,
  deleteCreateInput,
  findCurrentFocus,
  findTabByPathInCode,
  getExtension,
  getFileInfo,
  getLanguage,
  reorderTab,
} from "../functions";
import { TEditorRoot } from "../types";
import { IconButton } from "@material-ui/core";

interface TFile {
  path: string;
  children?: TFile[] | undefined;
}

function makeFileStructure(
  { path, children }: TFile,
  depth: number,
  classes: any,
  code: TEditorRoot,
  createInput: string,
  projectName: string,
  fileInfo: IFileInfo,
  fileStructure: TFile,
  drag: TDragState,
  functions: {
    moveFileOrDir: (
      projectName: string,
      oldPath: string,
      newPath: string
    ) => void;
    createDir: (projectName: string, deletePath: string) => void;
    createFile: (projectName: string, filePath: string) => void;
    deleteFileOrDir: (projectName: string, dirPath: string) => void;
    setCode: (code: TEditorRoot) => void;
    setDragInfo: (tabInfo: TDragState) => void;
    deleteDragInfo: () => void;
    setCreateInput: React.Dispatch<React.SetStateAction<string>>;
    setFileStructure: React.Dispatch<React.SetStateAction<TFile>>;
  }
) {
  function handleDirectoryToggle(event: React.MouseEvent<HTMLElement>) {
    (event.currentTarget.parentNode! as HTMLElement).classList.toggle(
      classes.close
    );
  }

  function handleClickFile(event: React.MouseEvent<HTMLElement>) {
    let addCodeCheck = false;
    let addTabCheck = true;
    const newRoot = (() => {
      if (code.codeOrderStack.length === 0) {
        addCodeCheck = true;
        return addCode(
          code.root,
          -1,
          {
            children: [],
            codeId: code.codeCount,
            focus: true,
            tabList: [
              {
                path: path,
                extension: getExtension(path),
                langauge: getLanguage(getExtension(path)),
                tabId: code.tabCount,
                content: "",
              },
            ],
            tabOrderStack: [code.tabCount],
            vertical: true,
          },
          false,
          true
        );
      }

      if (
        checkTabDuplicating(
          code.root,
          findCurrentFocus(code.codeOrderStack),
          path
        )
      ) {
        addTabCheck = false;
        const tabId = findTabByPathInCode(
          code.root,
          findCurrentFocus(code.codeOrderStack),
          path
        );
        return reorderTab(code.root, tabId);
      } else {
        return addTab(code.root, code.codeOrderStack[0], {
          path: path,
          extension: getExtension(path),
          langauge: getLanguage(getExtension(path)),
          tabId: code.tabCount,
          content: "",
        });
      }
    })();

    functions.setCode({
      ...code,
      root: newRoot,
      tabCount: addTabCheck ? code.tabCount + 1 : code.tabCount,
      codeCount: addCodeCheck ? code.codeCount + 1 : code.codeCount,
      codeOrderStack: addCodeCheck
        ? [code.codeCount, ...code.codeOrderStack]
        : code.codeOrderStack,
    });
  }

  function handleDragStartFile(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();

    functions.setDragInfo({ path: path, tabId: -1 });
  }

  function handleDragEndFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    functions.deleteDragInfo();
  }

  function handleDragEnterFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const pathList = drag.path.split("\\");
    pathList.pop();
    const parentPath = pathList.join("\\");

    document
      .getElementsByClassName(classes.fileWrapper)[0]
      .classList.remove(classes.drag);

    if (event.currentTarget.id !== parentPath) {
      event.currentTarget.classList.add(classes.drag);
    }
  }

  function handleDragLeaveFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.classList.remove(classes.drag);
  }

  function handleDropFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (drag.path === "default") return;

    const lastPath = drag.path.split("\\");

    if (document.getElementsByClassName(classes.drag).length > 0)
      document
        .getElementsByClassName(classes.drag)[0]
        .classList.remove(classes.drag);

    functions.moveFileOrDir(
      projectName,
      drag.path,
      `${event.currentTarget.id}\\${lastPath[lastPath.length - 1]}`
    );
  }

  function handleDragOverFile(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (path.includes("///create:")) {
    return (
      <div
        className={`${classes.file}`}
        style={{ paddingLeft: `${depth * 6 + 6}px` }}
        key={path}
      >
        {path === "///create:directory" ? <ArrowForwardIos /> : <List />}
        <input
          type="text"
          id="createFileOrDir"
          className={path}
          value={createInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            functions.setCreateInput(event.currentTarget.value);
          }}
          onKeyDown={(evnet: any) => {
            if ((event as any).key === "Enter") {
              const inputValue = (
                document.getElementById("createFileOrDir") as HTMLInputElement
              ).value;
              const classList =
                document.getElementById("createFileOrDir")?.classList;

              if (fileInfo.rename) {
                const lastPath = fileInfo.file.path.split("\\");
                const newPath = fileInfo.file.path.replace(
                  lastPath[lastPath.length - 1],
                  ""
                );

                if (lastPath[lastPath.length - 1] !== inputValue)
                  if (
                    checkSamePath(
                      fileStructure,
                      `${newPath}\\${inputValue}`
                    ) !== true
                  ) {
                    functions.moveFileOrDir(
                      projectName,
                      fileInfo.file.path,
                      `${newPath}\\${inputValue}`
                    );
                  }
                functions.setFileStructure(deleteCreateInput(fileStructure));
                functions.setCreateInput("");
              } else {
                if (
                  checkSamePath(
                    fileStructure,
                    `${fileInfo.file.path}\\${inputValue}`
                  ) !== true
                ) {
                  if (inputValue !== "") {
                    classList!.contains("///create:directory")
                      ? functions.createDir(
                        projectName,
                        `${fileInfo.file.path}\\${inputValue}`
                      )
                      : functions.createFile(
                        projectName,
                        `${fileInfo.file.path}\\${inputValue}`
                      );
                  }
                }
                functions.setFileStructure(deleteCreateInput(fileStructure));
                functions.setCreateInput("");
              }
            }
          }}
          autoFocus={true}
        />
      </div>
    );
  }

  if (children !== undefined) {
    const lastPath = path.split("\\");
    return (
      <div
        className={classes.depth}
        key={path}
        id={path}
        onDragEnter={handleDragEnterFile}
        onDragLeave={handleDragLeaveFile}
        onDrop={handleDropFile}
      >
        <div
          id={path}
          className={`${classes.file}`}
          style={{ paddingLeft: `${depth * 6 + 6}px` }}
          draggable={true}
          onClick={handleDirectoryToggle}
          onDragOver={handleDragOverFile}
          onDragStart={handleDragStartFile}
          onDragEnd={handleDragEndFile}
        >
          <ArrowForwardIos />
          {lastPath[lastPath.length - 1]}
        </div>
        <div className={`${classes.group}`}>
          {children?.map((v, i) =>
            makeFileStructure(
              v,
              depth + 1,
              classes,
              code,
              createInput,
              projectName,
              fileInfo,
              fileStructure,
              drag,
              functions
            )
          )}
        </div>
      </div>
    );
  }

  const lastPath = path.split("\\");

  return (
    <div
      id={path}
      key={path}
      className={classes.file}
      style={{ paddingLeft: `${depth * 6 + 6}px` }}
      draggable={true}
      onClick={handleClickFile}
      onDragStart={handleDragStartFile}
      onDragEnd={handleDragEndFile}
      onDragOver={handleDragOverFile}
      onDrop={(event: any) => {
        if (document.getElementsByClassName(classes.drag).length > 0)
          document
            .getElementsByClassName(classes.drag)[0]
            .classList.remove(classes.drag);

        const lastPath = drag.path.split("\\");

        if (path.split("\\").length === 1) {
          functions.moveFileOrDir(
            projectName,
            drag.path,
            lastPath[lastPath.length - 1]
          );
        }
      }}
      onDragEnter={() => {
        if (drag.path.split("\\").length !== 1)
          if (path.split("\\").length === 1) {
            document
              .getElementsByClassName(classes.fileWrapper)[0]
              .classList.add(classes.drag);
          }
      }}
    >
      {getLanguage(getExtension(path)) !== "default" ? (
        <span className={classes[getLanguage(getExtension(path))]}></span>
      ) : (
        <List />
      )}
      {lastPath[lastPath.length - 1]}
    </div>
  );
}

interface IFileInfo {
  file: TFile;
  copy: boolean;
  cut: boolean;
  rename: boolean;
}

export function Sidebar({
  fileStructure,
  projectName,
  functions,
  code,
  drag,
  open,
  setOpen
}: {
  fileStructure: TFile;
  projectName: string;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  code: TEditorRoot;
  drag: TDragState;
  functions: {
    moveFileOrDir: (
      projectName: string,
      oldPath: string,
      newPath: string
    ) => void;
    createDir: (projectName: string, deletePath: string) => void;
    createFile: (projectName: string, filePath: string) => void;
    deleteFileOrDir: (projectName: string, dirPath: string) => void;
    setCode: (code: TEditorRoot) => void;
    setDragInfo: (tabInfo: TDragState) => void;
    deleteDragInfo: () => void;
    setFileStructure: React.Dispatch<React.SetStateAction<TFile>>;
  };
}): JSX.Element {
  const classes = sidebarStyle();
  const fileWrapperRef = useRef<HTMLDivElement>(null);
  const [rightClick, setRightClick] = useState<boolean>(false);
  const [createInput, setCreateInput] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<IFileInfo>({
    file: { path: "", children: [] },
    copy: false,
    cut: false,
    rename: false,
  });

  function rightMouseClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.button === 2) {
      setFileInfo({
        file: fileStructure,
        copy: false,
        cut: false,
        rename: false,
      });
      if (
        getFileInfo(
          fileStructure,
          (event.target as HTMLElement).id as string
        ) !== undefined
      ) {
        setFileInfo({
          file: getFileInfo(
            fileStructure,
            (event.target as HTMLElement).id as string
          ) as TFile,
          copy: false,
          cut: false,
          rename: false,
        });
      } else {
        if (
          getFileInfo(
            fileStructure,
            (event.target as HTMLElement).parentElement?.id as string
          ) !== undefined
        ) {
          setFileInfo({
            file: getFileInfo(
              fileStructure,
              (event.target as HTMLElement).parentElement?.id as string
            ) as TFile,
            copy: false,
            cut: false,
            rename: false,
          });
        } else {
          if (
            getFileInfo(
              fileStructure,
              (event.target as HTMLElement).parentElement?.parentElement
                ?.id as string
            ) !== undefined
          ) {
            setFileInfo({
              file: getFileInfo(
                fileStructure,
                (event.target as HTMLElement).parentElement?.parentElement
                  ?.id as string
              ) as TFile,
              copy: false,
              cut: false,
              rename: false,
            });
          }
        }
      }

      setRightClick(true);
      document.getElementById(
        "fileFunctionMenu"
      )!.style.top = `${event.pageY}px`;
      document.getElementById(
        "fileFunctionMenu"
      )!.style.left = `${event.pageX}px`;

      return;
    }
  }

  function preventContextMenu(event: MouseEvent) {
    if (
      !(
        (event.target as HTMLElement).parentElement?.id ===
        "fileFunctionMenu" ||
        (event.target as HTMLElement).parentElement?.parentElement?.id ===
        "fileFunctionMenu"
      )
    ) {
      if (event.button === 0) {
        setRightClick(false);
      }
    }

    if (document.getElementById("createFileOrDir") !== null) {
      const inputValue = (
        document.getElementById("createFileOrDir") as HTMLInputElement
      ).value;
      const classList = document.getElementById("createFileOrDir")?.classList;

      if ((event.target as HTMLElement).tagName !== "INPUT") {
        if (fileInfo.rename) {
          const lastPath = fileInfo.file.path.split("\\");
          const newPath = fileInfo.file.path.replace(
            lastPath[lastPath.length - 1],
            ""
          );

          if (lastPath[lastPath.length - 1] !== inputValue)
            if (
              checkSamePath(fileStructure, `${newPath}\\${inputValue}`) !== true
            ) {
              functions.moveFileOrDir(
                projectName,
                fileInfo.file.path,
                `${newPath}\\${inputValue}`
              );
            }
          functions.setFileStructure(deleteCreateInput(fileStructure));
          setCreateInput("");
        } else {
          if (
            checkSamePath(
              fileStructure,
              `${fileInfo.file.path}\\${inputValue}`
            ) !== true
          ) {
            if (inputValue !== "") {
              classList!.contains("///create:directory")
                ? functions.createDir(
                  projectName,
                  `${fileInfo.file.path}\\${inputValue}`
                )
                : functions.createFile(
                  projectName,
                  `${fileInfo.file.path}\\${inputValue}`
                );
            }
          }
          functions.setFileStructure(deleteCreateInput(fileStructure));
          setCreateInput("");
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", preventContextMenu);
    fileWrapperRef.current?.addEventListener("auxclick", rightMouseClick);
    return () => {
      window.removeEventListener("mousedown", preventContextMenu);
      fileWrapperRef.current?.removeEventListener("auxclick", rightMouseClick);
    };
  }, [fileStructure, fileInfo]);

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <div className={classes.sidebar}>
      <div
        className={classes.rootDirectory}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          document
            .getElementsByClassName(classes.fileWrapper)[0]
            .classList.toggle(classes.rootClose);

          event.currentTarget.classList.toggle(classes.rootRotate);
        }}
      >
        <ArrowForwardIos />
        {projectName}
        <IconButton onClick={(e) => {
          e.stopPropagation()
          setOpen(open + 1)
        }} style={{
          position: "absolute", right: 0, padding: "0px", transform: "rotate(-90deg)",
        }}>
          <WebAssetIcon style={{ width: "20px", height: "20px" }} />
        </IconButton>
      </div>
      <div
        className={classes.fileWrapper}
        ref={fileWrapperRef}
        onContextMenu={(event: any) => {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }}
      >
        {fileStructure.children?.map((v, i) =>
          makeFileStructure(
            v,
            1,
            classes,
            code,
            createInput,
            projectName,
            fileInfo,
            fileStructure,
            drag,
            {
              ...functions,
              setCreateInput: setCreateInput,
            }
          )
        )}
      </div>
      {rightClick && (
        <div
          className={classes.fileFunctionMenu}
          id="fileFunctionMenu"
          onContextMenu={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }}
        >
          <div
            className={classes.fileMenu}
            onClick={() => {
              const value = (() => {
                if (fileInfo.file.children !== undefined) {
                  document
                    .getElementById(fileInfo.file.path)
                    ?.classList.remove(classes.close);
                  return addCreateInput(
                    fileStructure,
                    fileInfo.file.path,
                    false
                  );
                } else {
                  const pathList = fileInfo.file.path.split("\\");
                  pathList.pop();
                  const parentPath = pathList.join("\\");
                  document
                    .getElementById(parentPath)
                    ?.classList.remove(classes.close);
                  if (parentPath === "")
                    setFileInfo({
                      file: fileStructure,
                      copy: false,
                      cut: false,
                      rename: false,
                    });

                  return addCreateInput(
                    fileStructure,
                    parentPath === "" ? fileInfo.file.path : parentPath,
                    false
                  );
                }
              })();
              functions.setFileStructure(value);
              setRightClick(false);
            }}
          >
            <span>New File</span>
            <span></span>
          </div>
          <div
            className={classes.fileMenu}
            onClick={() => {
              const value = (() => {
                if (fileInfo.file.children !== undefined) {
                  document
                    .getElementById(fileInfo.file.path)
                    ?.classList.remove(classes.close);
                  return addCreateInput(
                    fileStructure,
                    fileInfo.file.path,
                    true
                  );
                } else {
                  const pathList = fileInfo.file.path.split("\\");
                  pathList.pop();
                  const parentPath = pathList.join("\\");
                  document
                    .getElementById(parentPath)
                    ?.classList.remove(classes.close);
                  if (parentPath === "")
                    setFileInfo({
                      file: fileStructure,
                      copy: false,
                      cut: false,
                      rename: false,
                    });

                  return addCreateInput(
                    fileStructure,
                    parentPath === "" ? fileInfo.file.path : parentPath,
                    true
                  );
                }
              })();
              functions.setFileStructure(value);
              setRightClick(false);
            }}
          >
            <span>New Directory</span>
            <span></span>
          </div>
          <div className={classes.divider}></div>
          <div
            className={classes.fileMenu}
            onClick={() => {
              setFileInfo({ ...fileInfo, rename: true });
              const lastPath = fileInfo.file.path.split("\\");
              setCreateInput(lastPath[lastPath.length - 1]);

              const value = addRenameField(fileStructure, fileInfo.file.path);

              functions.setFileStructure(value);
              setRightClick(false);
            }}
          >
            <span>Rename</span>
            <span>F2</span>
          </div>
          <div
            className={classes.fileMenu}
            onClick={() => {
              functions.deleteFileOrDir(projectName, fileInfo.file.path);
              setRightClick(false);
            }}
          >
            <span>Delete</span>
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
}
