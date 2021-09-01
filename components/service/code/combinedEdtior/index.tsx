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
  deleteCode,
  deleteTab,
  findEmptyCode,
  findTabByPathInCode,
  getExtension,
  getLanguage,
  insertCodeContent,
  reorderTab,
} from "../functions";
import { useCode } from "../../../../hooks/code";
import { useThemeData } from "../../../../hooks/theme";

export function CombinedEditor({
  tabList,
  tabOrderStack,
  codeId,
  focus,
  projectName,
  getCode,
  changeCode,
}: {
  tabList: TTab[];
  tabOrderStack: number[];
  codeId: number;
  focus: boolean;
  projectName: string;
  getCode: (projectName: string, filePath: string) => void;
  changeCode: (projectName: string, filePath: string, code: string) => void;
}): JSX.Element {
  const classes = editorStyle();
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TTab | undefined>(undefined);
  const [editorWidth, setEditorWidth] = useState<number>(0);
  const { drag } = useDrag();
  const { code, setCode } = useCode();
  const { data } = useThemeData();
  const [theme, setTheme] = useState<string>("dark");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    setTheme(data.theme);
  }, [data]);

  useEffect(() => {}, [tabOrderStack]);

  useEffect(() => {
    if (tab !== undefined && content != tab.content) {
      setCode({
        ...code,
        root: insertCodeContent(code.root, tab.path, content),
      });
    }
  }, [content]);

  useEffect(() => {
    setEditorWidth(
      Number(document.getElementById("content")?.clientWidth) / code.root.length
    );
  }, [code.root.length]);

  function handleResize() {
    setEditorWidth(
      Number(document.getElementById("content")?.clientWidth) / code.root.length
    );
  }

  useEffect(() => {
    const targetTab = tabList.find((tab) => tab.tabId === tabOrderStack[0]);
    setTab(targetTab);

    if (targetTab !== undefined) getCode(projectName, targetTab.path);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleDragEnterEditor(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();

    const editorWrapper = editorWrapperRef.current;

    if (editorWrapper === undefined) {
      return;
    }

    const dragOverlayDiv = document.createElement("div");
    dragOverlayDiv.className = classes.drag;
    dragOverlayDiv.id = `drag-overlay-${codeId}`;

    editorWrapper!.appendChild(dragOverlayDiv);

    const childDiv = document.createElement("div");
    childDiv.id = "drag-overlay-child";

    document.getElementById(`drag-overlay-${codeId}`)?.appendChild(childDiv);
  }

  function handleDragLeaveEditor(event: React.DragEvent<HTMLDivElement>) {
    const dragOverlayDiv = document.getElementById(`drag-overlay-${codeId}`);
    dragOverlayDiv?.parentNode?.removeChild(dragOverlayDiv);
  }

  function handleDragOverEditor(event: React.DragEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();

    if (tabList.length === 1 && tabOrderStack[0] === drag.tabId) {
      return;
    }

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
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.remove(classes.rightWrapper);
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.add(classes.leftWrapper);
      childDiv?.classList.add(classes.left);
      return;
    }

    if (
      event.pageX - editorWrapper!.offsetLeft >
      editorWrapper!.offsetWidth * 0.85
    ) {
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.remove(classes.leftWrapper);
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.add(classes.rightWrapper);
      childDiv?.classList.add(classes.right);
      return;
    }

    if (
      event.pageY - editorWrapper!.offsetTop <
      editorWrapper!.offsetHeight * 0.15
    ) {
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.remove(classes.bottomWrapper);
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.add(classes.topWrapper);
      childDiv?.classList.add(classes.top);
      return;
    }

    if (
      event.pageY - editorWrapper!.offsetTop >
      editorWrapper!.offsetHeight * 0.85
    ) {
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.remove(classes.topWrapper);
      document
        .getElementById(`drag-overlay-${codeId}`)
        ?.classList.add(classes.bottomWrapper);
      childDiv?.classList.add(classes.bottom);
      return;
    }

    childDiv?.classList.add(classes.center);
    return;
  }

  function handleDropToEditor(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (drag.path === "default") return;

    const dragOverlayDiv = document.getElementById(`drag-overlay-${codeId}`);
    dragOverlayDiv?.parentNode?.removeChild(dragOverlayDiv);

    if (tabList.length === 1 && tabOrderStack[0] === drag.tabId) {
      return;
    }

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
          drag.tabId !== -1 ? deleteTab(code.root, drag.tabId) : code.root,
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
        event.pageX - editorWrapper!.offsetLeft >
        editorWrapper!.offsetWidth * 0.85
      ) {
        return addCode(
          drag.tabId !== -1 ? deleteTab(code.root, drag.tabId) : code.root,
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
                content: "",
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
          drag.tabId !== -1 ? deleteTab(code.root, drag.tabId) : code.root,
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
                content: "",
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
          drag.tabId !== -1 ? deleteTab(code.root, drag.tabId) : code.root,
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
                content: "",
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
          return reorderTab(code.root, existingTabId);
        } else {
          return addTab(code.root, codeId, {
            path: drag.path,
            extension: getExtension(drag.path),
            langauge: getLanguage(getExtension(drag.path)),
            tabId: code.tabCount,
            content: "",
          });
        }
      }

      if (existingTabId === drag.tabId) {
        return code.root;
      }

      const tempRoot = deleteTab(code.root, drag.tabId);

      if (checkTabDuplicating(tempRoot, codeId, drag.path)) {
        return reorderTab(tempRoot, existingTabId);
      }

      return addTab(tempRoot, codeId, {
        path: drag.path,
        extension: getExtension(drag.path),
        langauge: getLanguage(getExtension(drag.path)),
        tabId: code.tabCount,
        content: "",
      });
    })();

    const centerCheck = !(
      event.pageX - editorWrapper!.offsetLeft <
        editorWrapper!.offsetWidth * 0.15 ||
      event.pageX - editorWrapper!.offsetLeft >
        editorWrapper!.offsetWidth * 0.85 ||
      event.pageY - editorWrapper!.offsetTop <
        editorWrapper!.offsetHeight * 0.15 ||
      event.pageY - editorWrapper!.offsetTop >
        editorWrapper!.offsetHeight * 0.85
    );
    const emptyCodeId = findEmptyCode(newRoot) ?? -1;

    setCode({
      ...code,
      codeCount: code.codeCount + (centerCheck ? 0 : 1),
      codeOrderStack: (centerCheck
        ? code.codeOrderStack
        : [code.codeCount, ...code.codeOrderStack]
      ).filter((codeId) => emptyCodeId !== codeId),
      tabCount: true ? code.tabCount + 1 : code.tabCount,
      root: emptyCodeId !== -1 ? deleteCode(newRoot, emptyCodeId) : newRoot,
      vertical: newRoot.length === 1 && code.codeCount === 1,
    });
  }

  return (
    <div
      id={`code-${codeId}`}
      className={classes.editor}
      style={{
        width: `${editorWidth}px`,
      }}
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
          theme={theme === "dark" ? "vs-dark" : "light"}
          path={tab?.path ?? ""}
          language={getLanguage(getExtension(tab?.path ?? "default"))}
          value={tab?.content ?? ""}
          onChange={(event: any) => {
            setContent(event);
          }}
        />
      </div>
    </div>
  );
}
