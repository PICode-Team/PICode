import React from "react";
import { codeStyle, sidebarStyle } from "../../styles/service/code";

function Sidebar(): JSX.Element {
  const classes = sidebarStyle();

  return <div className={classes.root}></div>;
}

export default function Code() {
  const classes = codeStyle();

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}></div>
    </div>
  );
}
