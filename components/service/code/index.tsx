import React, { useEffect, useState } from "react";
import { codeStyle } from "../../../styles/service/code/code";
import { Sidebar } from "./sidebar";
import { CombinedEditor } from "./combinedEdtior";
import { TCode, TEditorRoot } from "./types";
import { useCode } from "../../../hooks/code";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { useDrag } from "../../../hooks/drag";
import { addCode, getExtension, getLanguage } from "./functions";

function buildCodeLayout(
  codeList: TCode[],
  classes: ClassNameMap<"content" | "row" | "column" | "root">
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
              />
            </div>
            {v.children.length !== 0 &&
              buildCodeLayout(v.children ?? [], classes)}
          </div>
        );
      })}
    </React.Fragment>
  );
}

function EditorWrapper({ codeRoot }: { codeRoot: TEditorRoot | undefined }) {
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
      {buildCodeLayout(codeRoot?.root ?? [], classes)}
    </div>
  );
}

export default function Code(): JSX.Element {
  const classes = codeStyle();
  const [codeRoot, setCodeRoot] = useState<TEditorRoot | undefined>(undefined);
  const { code } = useCode();

  useEffect(() => {
    setCodeRoot(code);
  }, [code]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content} id="content">
        <EditorWrapper codeRoot={codeRoot} />
      </div>
    </div>
  );
}
