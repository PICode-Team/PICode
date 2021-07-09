import React from "react";
import { chatStyle } from "../../../styles/service/chat/chat";

export default function Chat() {
  const classes = chatStyle();

  return <div className={classes.root}></div>;
}
