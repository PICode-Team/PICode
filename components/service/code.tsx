import React from "react";
import {
  codeStyle,
  sidebarStyle,
  editorStyle,
  pathStyle,
  tabbarStyle,
} from "../../styles/service/code";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useEffect } from "react";
import { FiberManualRecord, Clear } from "@material-ui/icons";

interface TPathProps {
  path: string;
}

interface TTabbarProps {
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}

interface TTab {
  path: string;
}

interface TRender {
  path: string;
  ext: string;
  value: string;
}

function Sidebar(): JSX.Element {
  const classes = sidebarStyle();
  return <div className={classes.root}></div>;
}

function Tabbar({ path, setPath }: TTabbarProps) {
  const classes = tabbarStyle();
  const [tabList, setTabList] = useState<TTab[]>([
    { path: "package.json" },
    { path: "components/service/code.tsx" },
  ]);

  useEffect(() => {}, [path]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {tabList.map((o, idx) => {
          const lastPath = (() => {
            const tempList = o.path.split("/");
            return tempList[tempList.length - 1];
          })();

          return (
            <div
              key={`tab-${idx}`}
              className={classes.tab}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                const target = (() => {
                  const active = document.getElementsByClassName(
                    classes.active
                  );
                  if (active.length > 0) return active[0];
                  else return "";
                })();

                if (typeof target === "object")
                  target.classList.toggle(classes.active);
                event.currentTarget.classList.toggle(classes.active);
                setPath(o.path);
              }}
            >
              {o.path}
              <div className={classes.icon}></div>
              <div className={classes.text}>{lastPath}</div>
              <div className={classes.closeButton}>
                <Clear />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Path({ path }: TPathProps) {
  const classes = pathStyle();
  const [pathList, setPathList] = useState<string[]>([]);

  useEffect(() => {
    const tempList = path.split("/");
    setPathList(tempList);
  }, [path]);

  return (
    <React.Fragment>
      {pathList.map((o, idx) => (
        <span className={classes.path} key={`code-path-${idx}`}>
          <span className={classes.icon}></span>
          {o}
          <span className={classes.divider}>{` > `}</span>
        </span>
      ))}
      <span className={classes.path}>...</span>
    </React.Fragment>
  );
}

function CombinedEditor() {
  const classes = editorStyle();
  const [path, setPath] = useState<string>("components/service/code.tsx");
  const [renderData, setRenderData] = useState<TRender | undefined>(undefined);

  function getFileExt(filePath: string) {
    const ext = filePath.split(".")[1];
    switch (true) {
      case ext === "js" || ext === "jsx" || ext === "tsx":
        return "javascript";
      case ext === "py":
        return "python";
      case ext === "cpp":
        return "c++";
      case ext === "c":
        return "c";
      case ext === "json":
        return "json";
      default:
        return "not supported language";
    }
  }

  function getFileText(file: string) {
    return file;
  }

  useEffect(() => {
    setRenderData({
      ext: getFileExt(path),
      path: path,
      value: getFileText(path),
    });
  }, [path]);

  return (
    <div className={classes.editor}>
      <div className={classes.topbar}>
        <div className={classes.tabSection}>
          <Tabbar path={path} setPath={setPath} />
        </div>
        <div className={classes.pathSection}>
          <Path path={path} />
        </div>
      </div>
      <div className={classes.editorWrapper}>
        <Editor
          width="calc(100% - 1px)"
          height="calc(100% - 55px)"
          theme="vs-dark"
          path={renderData?.path}
          defaultLanguage={renderData?.ext}
          defaultValue={renderData?.value}
        />
      </div>
    </div>
  );
}

export default function Code(ctx: any) {
  const classes = codeStyle();

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>
        <div className={classes.coulmn}>
          <CombinedEditor />
          <CombinedEditor />
        </div>{" "}
        <div className={classes.coulmn}>
          <CombinedEditor />
          <CombinedEditor />
        </div>{" "}
        <div className={classes.coulmn}>
          <CombinedEditor />
          <CombinedEditor />
        </div>{" "}
        <div className={classes.coulmn}>
          <CombinedEditor />
          <CombinedEditor />
        </div>
      </div>
    </div>
  );
}
