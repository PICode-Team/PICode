import React, { useEffect, useState } from "react";
import { directoryStyle } from "../../../../styles/service/code/code";

export function Directory(): JSX.Element {
  const classes = directoryStyle();

  return <div className={classes.directory}></div>;
}
