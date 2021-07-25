import React, { useEffect, useState } from "react";
import { fileStyle } from "../../../../styles/service/code/code";

export function File(): JSX.Element {
  const classes = fileStyle();

  return <div className={classes.file}></div>;
}
