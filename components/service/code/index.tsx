import React, { useEffect, useState } from "react";
import { codeStyle } from "../../../styles/service/code/code";
import { Sidebar } from "./sidebar";
import { CombinedEditor } from "./combinedEdtior";
import { TCode, TEditorRoot } from "./types";
import { useCode } from "../../../hooks/code";

function buildCodeLayout(codeList: TCode[]): JSX.Element {
  const classes = codeStyle();

  return (
    <React.Fragment>
      {codeList.map((v: TCode, i: number) => {
        return (
          <div
            className={v.vertical ? classes.column : classes.row}
            key={`Code-Wrapper-${v.codeId}`}
          >
            <CombinedEditor
              tabList={v.tabList}
              tabOrderStack={v.tabOrderStack}
              codeId={v.codeId}
              focus={v.focus}
            />
            {buildCodeLayout(v.children)}
          </div>
        );
      })}
    </React.Fragment>
  );
}

function EditorWrapper({ root }: { root: TCode[] }) {
  if (root.length === 0) {
    return <div>undefined</div>;
  }

  return <React.Fragment>{buildCodeLayout(root)}</React.Fragment>;
}

export default function Code(): JSX.Element {
  const classes = codeStyle();
  const [codeRoot, setcodeRoot] = useState<TEditorRoot | undefined>(undefined);
  const { code, setCode } = useCode();

  useEffect(() => {
    setcodeRoot(code);
  }, [code]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>
        <div className={codeRoot?.vertical ? classes.column : classes.row}>
          <EditorWrapper root={codeRoot?.root ?? []} />
        </div>
      </div>
    </div>
  );
}
