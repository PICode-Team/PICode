import React from "react";
import { statStyle } from "../../../styles/service/stat/stat";

export default function Stat() {
  const classes = statStyle();

  return <div className={classes.root}></div>;
}
