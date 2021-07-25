import React, { useEffect, useState } from "react";
import { pathStyle } from "../../../../../styles/service/code/code";

export function Path({ path }: { path: string }): JSX.Element {
  const classes = pathStyle();
  const [pathList, setPathList] = useState<string[]>([]);

  useEffect(() => {
    const tempList = path.split("/");
    setPathList(tempList);
  }, [path]);

  return (
    <div className={classes.pathWrapper}>
      {pathList.map((o, idx) => (
        <span className={classes.path} key={`code-path-${idx}`}>
          <span className={classes.icon}></span>
          {o}
          <span className={classes.divider}>{` > `}</span>
        </span>
      ))}
      <span className={classes.path}>...</span>
    </div>
  );
}
