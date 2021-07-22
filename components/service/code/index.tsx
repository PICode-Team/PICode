import React, { useEffect, useState } from "react";
import { codeStyle } from "../../../styles/service/code/code";
import { Sidebar } from "./sidebar";
import { CombinedEditor } from "./combinedEdtior";
import { TCode, TEditorRoot } from "./types";
import { useCode } from "../../../hooks/code";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

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

function EditorWrapper({ root }: { root: TCode[] }) {
  const classes = codeStyle();

  if (root.length === 0) {
    return <div>undefined</div>;
  }

  return <React.Fragment>{buildCodeLayout(root, classes)}</React.Fragment>;
}

export default function Code(): JSX.Element {
  const classes = codeStyle();
  const [codeRoot, setCodeRoot] = useState<TEditorRoot | undefined>(undefined);
  const { code } = useCode();

  useEffect(() => {
    setCodeRoot(undefined);
    setCodeRoot(code);
    console.log(code);
  }, [code]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content} id="content">
        <div className={codeRoot?.vertical ? classes.column : classes.row}>
          <EditorWrapper root={codeRoot?.root ?? []} />
        </div>
      </div>
    </div>
  );
}
