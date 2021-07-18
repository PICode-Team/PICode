import React from "react";
import { LayoutStyle } from "../../styles/layout/layout";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";

export function Layout(ctx: any) {
  const classes = LayoutStyle();

  if (typeof window !== "undefined") {
    if (ctx.session.userId === undefined) {
      window.location.href = "/"
    }
  }

  return (
    <div className={classes.main}>
      <Topbar {...ctx} />
      <div className={classes.contentWrapper}>
        <Sidebar {...ctx} />
        {ctx.children}
      </div>
    </div>
  );
}
