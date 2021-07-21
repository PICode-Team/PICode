import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { editorStyle } from "../../../../styles/service/code/code";
import { Tabbar } from "./tabbar";
import { Path } from "./path";
import { TTab } from "../types";
import { useDrag } from "../../../../hooks/drag";
import {
  addCode,
  addTab,
  checkTabDuplicating,
  deleteTab,
  findTabByPathInCode,
  getExtension,
  getLanguage,
  reorderTab,
} from "../functions";
import { useCode } from "../../../../hooks/code";

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
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TTab | undefined>(undefined);
  const { drag } = useDrag();
  const { code, setCode } = useCode();

  useEffect(() => {
    setTab(tabList.find((tab) => tab.tabId === tabOrderStack[0]));
  }, [tabOrderStack]);

  function handleDragEnterEditor(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();

    const editorWrapper = editorWrapperRef.current;

    if (editorWrapper === undefined) {
      return;
    }

    const dragOverlayDiv = document.createElement("div");
    dragOverlayDiv.className = classes.drag;
    dragOverlayDiv.id = "drag-overlay";

    editorWrapper!.appendChild(dragOverlayDiv);

    const childDiv = document.createElement("div");
    childDiv.id = "drag-overlay-child";

    document.getElementById("drag-overlay")?.appendChild(childDiv);
  }

  function handleDragLeaveEditor(event: React.DragEvent<HTMLDivElement>) {
    const dragOverlayDiv = document.getElementById("drag-overlay");
    dragOverlayDiv?.parentNode?.removeChild(dragOverlayDiv);
  }

  function handleDragOverEditor(event: React.DragEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();
    const editorWrapper = editorWrapperRef.current;

    if (editorWrapper === undefined) {
      return;
    }

    const childDiv = document.getElementById("drag-overlay-child");
    childDiv?.classList.remove(classes.top);
    childDiv?.classList.remove(classes.bottom);
    childDiv?.classList.remove(classes.left);
    childDiv?.classList.remove(classes.right);
    childDiv?.classList.remove(classes.center);

    if (
      event.pageX - editorWrapper!.offsetLeft <
      editorWrapper!.offsetWidth * 0.15
    ) {
      childDiv?.classList.add(classes.left);
      return;
    }

    if (
      event.pageX - editorWrapper!.offsetLeft >
      editorWrapper!.offsetWidth * 0.85
    ) {
      childDiv?.classList.add(classes.right);
      return;
    }

    if (
      event.pageY - editorWrapper!.offsetTop <
      editorWrapper!.offsetHeight * 0.15
    ) {
      childDiv?.classList.add(classes.top);
      return;
    }

    if (
      event.pageY - editorWrapper!.offsetTop >
      editorWrapper!.offsetHeight * 0.85
    ) {
      childDiv?.classList.add(classes.bottom);
      return;
    }

    childDiv?.classList.add(classes.center);
    return;
  }

  function handleDropToEditor(event: React.DragEvent<HTMLDivElement>) {
    console.log(1);

    event.preventDefault();
    const dragOverlayDiv = document.getElementById("drag-overlay");
    dragOverlayDiv?.parentNode?.removeChild(dragOverlayDiv);

    const editorWrapper = editorWrapperRef.current;

    if (editorWrapper === undefined) {
      return;
    }

    const newRoot = (() => {
      if (
        event.pageX - editorWrapper!.offsetLeft <
        editorWrapper!.offsetWidth * 0.15
      ) {
        return addCode(
          code.root,
          Number(editorWrapper?.parentElement?.id.split("-")[1]),
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
        );
      }

      if (
        event.pageX - editorWrapper!.offsetLeft >
        editorWrapper!.offsetWidth * 0.85
      ) {
        return addCode(
          code.root,
          Number(editorWrapper?.parentElement?.id.split("-")[1]),
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
          false
        );
      }

      if (
        event.pageY - editorWrapper!.offsetTop <
        editorWrapper!.offsetHeight * 0.15
      ) {
        return addCode(
          code.root,
          Number(editorWrapper?.parentElement?.id.split("-")[1]),
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
            vertical: false,
          },
          true,
          true
        );
      }

      if (
        event.pageY - editorWrapper!.offsetTop >
        editorWrapper!.offsetHeight * 0.85
      ) {
        return addCode(
          code.root,
          Number(editorWrapper?.parentElement?.id.split("-")[1]),
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
            vertical: false,
          },
          true,
          false
        );
      }

      const existingTabId = findTabByPathInCode(code.root, codeId, drag.path);

      if (drag.tabId === -1) {
        if (checkTabDuplicating(code.root, codeId, drag.path)) {
          return reorderTab(
            code.root,
            Number(event.currentTarget.id.split("-")[1])
          );
        } else {
          return addTab(code.root, codeId, {
            path: drag.path,
            extension: getExtension(drag.path),
            langauge: getLanguage(getExtension(drag.path)),
            tabId: code.tabCount,
          });
        }
      }

      const tempRoot = deleteTab(code.root, drag.tabId);

      if (tabOrderStack.includes(existingTabId)) {
        return reorderTab(
          code.root,
          Number(event.currentTarget.id.split("-")[1])
        );
      }

      return addTab(code.root, codeId, {
        path: drag.path,
        extension: getExtension(drag.path),
        langauge: getLanguage(getExtension(drag.path)),
        tabId: code.tabCount,
      });
    })();

    setCode({
      ...code,
      codeCount: code.codeCount + 1,
      codeOrderStack: [code.codeCount, ...code.codeOrderStack],
      tabCount: true ? code.tabCount + 1 : code.tabCount,
      root: newRoot,
      vertical: newRoot.length === 1 && code.codeCount === 1,
    });
  }

  return (
    <div id={`code-${codeId}`} className={classes.editor}>
      <div className={classes.topbar}>
        <Tabbar
          tabList={tabList}
          tabOrderStack={tabOrderStack}
          codeId={codeId}
          focus={focus}
        />
        <Path path={tab?.path ?? ""} />
      </div>
      <div
        className={`${classes.editorWrapper} ${
          drag.path !== "default" && classes.wrapperDrag
        }`}
        ref={editorWrapperRef}
        onDragEnter={handleDragEnterEditor}
        onDragLeave={handleDragLeaveEditor}
        onDragOver={handleDragOverEditor}
        onDrop={handleDropToEditor}
      >
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
