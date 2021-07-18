import React, { useEffect, useState } from "react";
import { tabbarStyle } from "../../../../../styles/service/code/code";
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

  return (
    <div className={classes.tabbar}>
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
