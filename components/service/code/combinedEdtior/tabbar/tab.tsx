import React, { useEffect, useState } from "react";
import { tabStyle } from "../../../../../styles/service/code/code";
import { Clear } from "@material-ui/icons";
import {
  addTab,
  addToDropTab,
  checkTabDuplicating,
  deleteCode,
  deleteTab,
  findCurrentFocus,
  findEmptyCode,
  findTabByPathInCode,
  getExtension,
  getLanguage,
  moveTab,
  reorderStack,
  reorderTab,
} from "../../functions";
import { useCode } from "../../../../../hooks/code";
import { useDrag } from "../../../../../hooks/drag";

export function Tab({
  path,
  tabId,
  tabOrderStack,
  focus,
  codeId,
}: {
  path: string;
  tabId: number;
  tabOrderStack: number[];
  focus: boolean;
  codeId: number;
}): JSX.Element {
  const classes = tabStyle();
  const [lastPath, setLastPath] = useState<string>("");
  const { code, setCode } = useCode();
  const { drag, setDragInfo, deleteDragInfo } = useDrag();

  useEffect(() => {
    (() => {
      const tempList = path.split("/");
      setLastPath(tempList[tempList.length - 1]);
    })();
  }, [path]);

  function handleTabActive(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    if (
      (event.target as HTMLElement).tagName === "svg" ||
      (event.target as HTMLElement).tagName === "path"
    )
      return;

    const newRoot = reorderTab(code.root, tabId);

    setCode({
      ...code,
      root: newRoot,
      codeOrderStack:
        codeId === code.codeOrderStack[0]
          ? code.codeOrderStack
          : reorderStack(code.codeOrderStack, codeId),
    });
  }

  function handleTabClose(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const newRoot = deleteTab(code.root, tabId);
    const emptyCodeId = findEmptyCode(newRoot) ?? -1;

    setCode({
      ...code,
      root: emptyCodeId !== -1 ? deleteCode(newRoot, emptyCodeId) : newRoot,
      codeOrderStack: code.codeOrderStack.filter(
        (codeId) => emptyCodeId !== codeId
      ),
    });
  }

  function handleDragStartTab(event: React.DragEvent<HTMLElement>) {
    setCode({ ...code, root: reorderTab(code.root, tabId) });
    setDragInfo({ path: path, tabId: tabId });
  }
  function handleDragEndTab(event: React.DragEvent<HTMLElement>) {
    deleteDragInfo();
  }

  function handleDragEnterTab(event: React.DragEvent<HTMLElement>) {
    if (drag.tabId !== tabId) event.currentTarget.classList.add(classes.drag);
  }

  function handleDragLeaveTab(event: React.DragEvent<HTMLElement>) {
    event.currentTarget.classList.remove(classes.drag);
  }

  function handleDragOverTab(event: React.DragEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();
  }

  function handleDropTab(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();

    if (drag.path === "default") return;

    if (
      findTabByPathInCode(code.root, codeId, drag.path) ===
      Number(event.currentTarget.id.split("-")[1])
    )
      return;

    const targetList = document.getElementsByClassName(classes.drag);

    for (let i = 0; i < targetList.length; i++) {
      targetList[i].classList.remove(classes.drag);
    }

    const newRoot = (() => {
      const existingTabId = findTabByPathInCode(code.root, codeId, drag.path);

      if (drag.tabId === -1) {
        if (checkTabDuplicating(code.root, codeId, drag.path)) {
          return moveTab(
            code.root,
            codeId,
            existingTabId,
            Number(event.currentTarget.id.split("-")[1])
          );
        } else {
          return addToDropTab(
            code.root,
            codeId,
            Number(event.currentTarget.id.split("-")[1]),
            {
              path: drag.path,
              extension: getExtension(drag.path),
              langauge: getLanguage(getExtension(drag.path)),
              tabId: code.tabCount,
              content: "",
            }
          );
        }
      }

      const tempRoot = deleteTab(code.root, drag.tabId);

      if (tabOrderStack.includes(existingTabId)) {
        return moveTab(
          code.root,
          codeId,
          existingTabId,
          Number(event.currentTarget.id.split("-")[1])
        );
      }

      return addToDropTab(
        tempRoot,
        codeId,
        Number(event.currentTarget.id.split("-")[1]),
        {
          path: drag.path,
          extension: getExtension(drag.path),
          langauge: getLanguage(getExtension(drag.path)),
          tabId: code.tabCount,
          content: "",
        }
      );
    })();

    const existingTabId = findTabByPathInCode(code.root, codeId, drag.path);

    setCode({
      ...code,
      root: newRoot,
      tabCount:
        (drag.tabId === -1 &&
          checkTabDuplicating(code.root, codeId, drag.path)) ||
        (drag.tabId !== -1 && tabOrderStack.includes(existingTabId))
          ? code.tabCount
          : code.tabCount + 1,
    });
  }

  return (
    <div
      id={`tab-${tabId}`}
      className={`${classes.tab} ${
        tabId === tabOrderStack[0] ? classes.active : ""
      }`}
      onClick={handleTabActive}
      draggable={true}
      onDragStart={handleDragStartTab}
      onDragEnd={handleDragEndTab}
      onDragEnter={handleDragEnterTab}
      onDragLeave={handleDragLeaveTab}
      onDrop={handleDropTab}
      onDragOver={handleDragOverTab}
    >
      <div className={classes.icon}></div>
      <div className={classes.text}>{lastPath}</div>
      <div className={classes.closeButton} onClick={handleTabClose}>
        <Clear />
      </div>
    </div>
  );
}
