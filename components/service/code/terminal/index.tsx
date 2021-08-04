/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Ansi from "ansi-to-react";
import { terminalStyle } from "../../../../styles/service/code/code";
import { throttle } from "lodash";

function Terminal(props: any): JSX.Element {

  return <div
    contentEditable={false}
    draggable={false}
    style={{ height: "300px", width: `${props.width}`, display: "inline-block", overflow: "scroll", outline: "none" }}>
    {props.content[props.id]?.map((v: string) => <Ansi key={v}>{v}</Ansi>)}
    <span contentEditable={true} draggable={true} style={{ outline: "none", fontFamily: "monospace", fontSize: "14px" }}
      onKeyDown={(e: any) => {
        if (e.key === "Enter") {
          props.ws.current.send(JSON.stringify({
            category: "terminal",
            type: "commandTerminal",
            data: {
              command: e.target.innerText,
              id: props.id
            }
          }))
          e.target.innerText = ""
        }
      }}
    />

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
    terminalContent.push(<Terminal {...props} id={props.uuid[i]} width={`${100 / props.terminalCount}%`} />)
  }
  return <div className={classes.terminal} style={{ height: `${props.height}px` }}>
    <div draggable={false} className={classes.resizerBar} />
    {terminalContent.map((v: JSX.Element) => v)}
  </div>
}
