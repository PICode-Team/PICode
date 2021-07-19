import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { editorStyle } from "../../../../styles/service/code/code";
import { Tabbar } from "./tabbar";
import { Path } from "./path";
import { TTab } from "../types";
import { useDrag } from "../../../../hooks/drag";

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
  const {} = useDrag();

  useEffect(() => {
    setTab(tabList[tabOrderStack[0]]);
  }, [tabOrderStack]);

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const targetCode = (() => {
      let eventTarget = (event.target as HTMLElement).parentElement;
      while (true) {
        if (eventTarget) {
          for (let i = 0; i < eventTarget.classList.length; i++) {
            if (eventTarget.classList[i] === classes.editor) {
              return true;
            }
          }
          eventTarget = eventTarget.parentElement;
        } else {
          return false;
        }
      }
    })();
  }

  function handleBlur() {}

  return (
    <div
      id={`${codeId}`}
      className={classes.editor}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
