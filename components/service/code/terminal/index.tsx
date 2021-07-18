import React, { useEffect, useState } from "react";
import { terminalStyle } from "../../../../styles/service/code/code";

export function Terminal(): JSX.Element {
  const classes = terminalStyle();

  return <div className={classes.terminal}></div>;
}
