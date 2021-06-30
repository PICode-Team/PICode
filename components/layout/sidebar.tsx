import React from "react";
import { RowStyle, SidebarStyle } from "../../styles/layout/sidebar";
import { sidebarData } from "./data";

function Row(props: {
  data: { url: string; icon: string; title: string };
}): JSX.Element {
  const classes = RowStyle();
  return (
    <a className={classes.row} href={props.data.url}>
      <span>{props.data.title}</span>
    </a>
  );
}

export function Sidebar() {
  let data: any = sidebarData;
  const classes = SidebarStyle();
  return (
    <div className={classes.sideBar}>
      {Object.keys(data).map((v: string, idx: number) => (
        <Row data={data[v]} key={idx} />
      ))}
    </div>
  );
}
