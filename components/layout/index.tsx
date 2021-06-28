import { Header } from "./header/index";
import { Sidebar } from "./sidebar/index";
import React from "react";
import { layoutStyle } from "../../styles/layout/layout";

export default function Layout(ctx:any,{ children }: any) {
  const theme = layoutStyle(ctx.theme);
  const classes = theme();

  return (
    <React.Fragment>
      <Header />
      <div >
        <Sidebar />
        {children}
      </div>
    </React.Fragment>
  );
}
