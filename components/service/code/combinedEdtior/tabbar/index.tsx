import React, { useEffect, useState } from "react";
import { useDrag } from "../../../../../hooks/drag";
import { tabbarStyle, tabStyle } from "../../../../../styles/service/code/code";
import { TTab } from "../../types";
import { Tab } from "./tab";

export function Tabbar({
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
  const classes = tabbarStyle();
  const tabClasses = tabStyle();
  const { drag } = useDrag();

  function handleDragOverTabbar(event: React.DragEvent<HTMLElement>) {}

  function handleBlurTabbar(event: React.FocusEvent<HTMLDivElement>) {}

  return (
    <div
      className={`${classes.tabbar}`}
      onDragEnter={(event: React.DragEvent<HTMLDivElement>) => {
        const hoverElement = document.getElementsByClassName(tabClasses.drag);

        if (hoverElement.length !== 0) {
          if (hoverElement[0] === event.currentTarget) {
            return;
          }
          hoverElement[0].classList.toggle(tabClasses.drag);
        }

        event.currentTarget.classList.toggle(tabClasses.drag);
      }}
    >
      <div className={classes.section}>
        {tabList.map((o, idx) => (
          <Tab
            key={`Tab-${codeId}-${idx}`}
            path={o.path}
            tabId={o.tabId}
            tabOrderStack={tabOrderStack}
            focus={focus}
          />
        ))}
      </div>
    </div>
  );
}
