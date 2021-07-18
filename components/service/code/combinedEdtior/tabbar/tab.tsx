import React, { useEffect, useState } from "react";
import { tabStyle } from "../../../../../styles/service/code/code";
import { Clear } from "@material-ui/icons";
import {
  deleteCode,
  deleteTab,
  findCodeByPath,
  findEmptyCode,
  reorderStack,
  reorderTab,
} from "../../functions";
import { useCode } from "../../../../../hooks/code";

export function Tab({
  path,
  tabId,
  tabOrderStack,
  focus,
}: {
  path: string;
  tabId: number;
  tabOrderStack: number[];
  focus: boolean;
}): JSX.Element {
  const classes = tabStyle();
  const [lastPath, setLastPath] = useState<string>("");
  const { code, setCode } = useCode();

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

    const targetActiveTab = (() => {
      const active = document.getElementsByClassName(classes.active);
      if (active.length > 0) return active[0];
      else return "";
    })();

    if (typeof targetActiveTab === "object")
      targetActiveTab.classList.toggle(classes.active);
    event.currentTarget.classList.toggle(classes.active);

    const newRoot = reorderTab(code.root, tabId);
    const targetCodeId = findCodeByPath(code.root, path);

    setCode({
      ...code,
      root: newRoot,
      codeOrderStack:
        targetCodeId === code.codeOrderStack[0]
          ? code.codeOrderStack
          : reorderStack(code.codeOrderStack, targetCodeId),
    });
  }

  function handleTabClose(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const newRoot = deleteTab(code.root, tabId);
    const emptyCodeId = findEmptyCode(newRoot);

    setCode({
      ...code,
      root: emptyCodeId !== -1 ? deleteCode(newRoot, emptyCodeId) : newRoot,
      codeOrderStack:
        emptyCodeId !== -1
          ? reorderStack(code.codeOrderStack, emptyCodeId, true)
          : code.codeOrderStack,
    });
  }

  // ===========================================================

  function handleDropTab() {}

  function handleDragOverTab() {}

  function handleDragStartTab() {}

  function handleDragEndTab() {}

  // ===========================================================

  function handleDoubleClickTab() {}

  function handleMouseDownTab() {}

  function handleMouseMoveTab() {}

  function handleMouseUpTab() {}

  // ===========================================================

  return (
    <div
      className={`${classes.tab} ${
        tabId === tabOrderStack[0] ? classes.active : ""
      }`}
      onClick={handleTabActive}
    >
      {path}
      <div className={classes.icon}></div>
      <div className={classes.text}>{lastPath}</div>
      <div className={classes.closeButton} onClick={handleTabClose}>
        <Clear />
      </div>
    </div>
  );
}
