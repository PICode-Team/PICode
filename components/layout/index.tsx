/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { LayoutStyle } from "../../styles/layout/layout";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import Messenger from "../service/chat/messenger";
import { throttle } from "lodash";
import UserMouse from "./usermouse";
import { sidebarData } from "./data";
import { useRouter } from "next/router";

interface IUserMouse {
  x: number;
  y: number;
}

export interface ISocket {
  workingPath: string;
  userMouse?: { x: number; y: number; screenSize: IUserMouse };
}

export function Layout(ctx: any) {
  const classes = LayoutStyle();
  const pageData: any = sidebarData;
  const route = useRouter();
  let ws = React.useRef<WebSocket | null>(null);
  const [userMouse, setUserMouse] =
    React.useState<{ x: number; y: number; screenSize: IUserMouse }>();
  const [loginUser, setLoginUser] =
    React.useState<{ loginId: string; workInfo: ISocket }[]>();
  const [pageName, setPageName] = useState({
    name: "",
    icon: undefined,
  });
  const [alertData, setAlertData] = React.useState();

  if (typeof window !== "undefined") {
    if (ctx.session.userId === undefined) {
      window.location.href = "/";
    }
  }

  const getLoginUserData = () => {
    ws.current = new WebSocket(
      `ws://localhost:8000/?userId=${ctx.session.userId}`
    );
    ws.current.onopen = () => {
      if (ws.current!.readyState === WebSocket.OPEN) {
        ws.current!.send(JSON.stringify({ category: "connect" }));
        ws.current!.send(
          JSON.stringify({
            category: "work",
            type: "getWorkingPath",
            data: {
              workingPath: ctx.path,
            },
          })
        );
      }
    };

    ws.current.onmessage = (msg: any) => {
      let loginUserData = JSON.parse(msg.data);

      if (loginUserData.type === "getWorkingPath") {
        setLoginUser(loginUserData.data);
      }
    };
  };

  React.useEffect(() => {
    getLoginUserData();
    for (let i in pageData) {
      if (pageData[i].url === route.route) {
        setPageName({
          name: pageData[i].title,
          icon: pageData[i].icon
        })
      } else {
        if (pageData[i].subUrl !== undefined && pageData[i].subUrl.some((v: any) => v === route.route)) {
          if (pageData[i].children !== undefined) {
            let realTile = pageData[i].children.find((v1: any) => v1.url === route.route || v1.subUrl.some((v2: any) => v2 === route.route))
            setPageName({
              name: realTile.title,
              icon: realTile.icon
            })
          } else {
            setPageName({
              name: pageData[i].title,
              icon: pageData[i].icon
            })
          }
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (ws.current === null) return;
    if (ws.current!.readyState === WebSocket.OPEN) {
      let payload: ISocket = {
        workingPath: ctx.path,
      };
      ws.current!.send(
        JSON.stringify({
          category: "work",
          type: "getWorkingPath",
          data: payload,
        })
      );
    }
  }, [ctx.path]);

  const userMouseMoveCapture = React.useCallback(
    throttle((e) => {
      if (
        ctx.path === "/code" ||
        ctx.path === "/note" ||
        ctx.path === "/chat" ||
        ctx.path === "/"
      ) {
        setUserMouse({
          x: e.clientX,
          y: e.clientY,
          screenSize: {
            x: window.innerWidth,
            y: window.innerHeight,
          },
        });
      }
    }, 100),
    []
  );

  React.useEffect(() => {
    if (userMouse === null) return;
    if (ws.current === null) return;
    if (ws.current!.readyState === WebSocket.OPEN) {
      let payload: ISocket = {
        workingPath: ctx.path,
      };
      if (
        ctx.path === "/code" ||
        ctx.path === "/note" ||
        ctx.path === "/chat" ||
        ctx.path === "/"
      ) {
        payload.userMouse = userMouse;
      }
      ws.current!.send(
        JSON.stringify({
          category: "work",
          type: "getWorkingPath",
          data: payload,
        })
      );
    }
  }, [userMouse]);

  return (
    <div className={classes.main} onMouseMoveCapture={userMouseMoveCapture}>
      <Topbar {...ctx} loginUser={loginUser} ws={ws} />
      <div className={classes.contentWrapper}>
        <Sidebar {...ctx} />
        <div style={{ width: "100%", height: "calc(100% - 41px)" }}>
          <div className={classes.pageName}>
            {pageName.icon}
            {pageName.name}
          </div>
          {React.cloneElement(ctx.children, {
            path: ctx.path,
            session: ctx.session,
            ws:
              ws.current !== null &&
              ws.current!.readyState === WebSocket.OPEN &&
              ws,
          })}
        </div>
      </div>
      {loginUser !== undefined && loginUser.length > 1 && (
        <UserMouse
          loginUser={loginUser as any}
          loginId={ctx.session.userId}
          path={ctx.path}
        />
      )}
      <Messenger
        ws={
          ws.current !== null && ws.current!.readyState === WebSocket.OPEN && ws
        }
        userId={ctx.session.userId}
      />
    </div>
  );
}
