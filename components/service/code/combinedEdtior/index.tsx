import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { editorStyle } from "../../../../styles/service/code/code";
import { Tabbar } from "./tabbar";
import { Path } from "./path";
import { TTab } from "../types";

export function CombinedEditor({
  tabList,
  tabOrderStack,
  codeId,
  focus,
}: {
  tabList: TTab[];
  tabOrderStack: number[];
  codeId: number;
  focus: boolean;
}): JSX.Element {
  const classes = editorStyle();
  const [tab, setTab] = useState<TTab | undefined>(tabList[tabOrderStack[0]]);

  useEffect(() => {
    setTab(tabList[tabOrderStack[0]]);
  }, [tabOrderStack]);

  return (
    <div className={classes.editor}>
      <div className={classes.topbar}>
        <Tabbar
          tabList={tabList}
          tabOrderStack={tabOrderStack}
          codeId={codeId}
          focus={focus}
        />
        <Path path={tab?.path ?? ""} />
      </div>
      <div className={classes.editorWrapper}>
        <Editor
          width="calc(100% - 1px)"
          height="calc(100% - 55px)"
          theme="vs-dark"
          path={tab?.path ?? ""}
          defaultLanguage={tab?.langauge ?? ""}
          defaultValue={""}
        />
      </div>
    </div>
  );
}
