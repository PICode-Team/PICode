/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Ansi from "ansi-to-react";
import { terminalStyle } from "../../../../styles/service/code/code";
import { throttle } from "lodash";

function Terminal(props: any): JSX.Element {

  return <div
    contentEditable={true}
    style={{ height: "300px", width: `${props.width}`, display: "inline-block", overflow: "scroll", outline: "none" }}
    onKeyDown={(event) => {
      if (event.key === "Backspace") {
        if (event.currentTarget.textContent === `${props.projectName}@${props.ctx.session.userId}>`) {
          event.preventDefault();
        }
      }
    }}>
    <span contentEditable={false} draggable={false}>
      {`${props.projectName}@${props.ctx.session.userId}>`}
    </span>
  </div >;
}

export default function TerminalContent(props: any): JSX.Element {
  const classes = terminalStyle();

  const userMouseMoveCapture = React.useCallback(
    throttle((e) => {
      console.log(e)
    }, 200),
    []
  );

  let terminalContent = [];
  for (let i = 0; i < props.terminalCount; i++) {
    terminalContent.push(<Terminal {...props} width={`${100 / props.terminalCount}%`} />)
  }
  return <div className={classes.terminal} style={{ height: `${props.height}px` }}>
    <div draggable={false} className={classes.resizerBar} />
    {terminalContent.map((v: JSX.Element) => v)}
  </div>
}
