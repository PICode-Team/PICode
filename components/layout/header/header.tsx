import React from "react";
import { headerStyle } from "../../../styles/layout/header";

export default function Header(ctx: any) {
  const theme = headerStyle(ctx.theme);
  const classes = theme();

  return <header className={classes.root}></header>;
}
