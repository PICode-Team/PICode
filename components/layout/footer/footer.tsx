import React from "react";
import { footerStyle } from "../../../styles/layout/footer";

export default function Footer(ctx: any) {
  const theme = footerStyle(ctx.theme);
  const classes = theme();

  return <footer className={classes.root}></footer>;
}
