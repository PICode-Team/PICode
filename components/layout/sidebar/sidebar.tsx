import React from "react";
import { sidebarStyle, rowStyle } from "../../../styles/layout/sidebar";
import { FiberManualRecord } from "@material-ui/icons";

interface TRowProps {
  text: string;
}

function Row(props: TRowProps): JSX.Element {
  const theme = rowStyle();
  const classes = theme();

  return (
    <a className={classes.root}>
      <div className={classes.row}>
        <FiberManualRecord />
        <span className={classes.text}>{props.text}</span>
      </div>
    </a>
  );
}

export default function Sidebar(ctx: any): JSX.Element {
  const theme = sidebarStyle(ctx.theme);
  const classes = theme();

  return (
    <aside className={classes.root}>
      <Row text="test" />
      <Row text="test" />
      <Row text="test" />
      <Row text="test" />
      <Row text="test" />
    </aside>
  );
}
