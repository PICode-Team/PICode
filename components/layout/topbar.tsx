/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { IconButton } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../modules/theme";
import { TopbarStyle } from "../../styles/layout/topbar";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import NotificationsIcon from "@material-ui/icons/Notifications";
import UserInfo from "./item/tooltip";
import CreateIcon from "@material-ui/icons/Create";
import { useEffect } from "react";
import { ISocket } from ".";
import AlertDialog from "./item/alert";

interface IUserWorkInfo {
  userId: string;
  workInfo: ISocket;
  userThumbnail: string;
}

export function Topbar(ctx: any) {
  const theme = useSelector((state: any) => state.theme).theme;
  const dispatch = useDispatch();
  const classes = TopbarStyle();
  const [open, setOpen] = React.useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [alarmData, setAlarmData] = React.useState<any[]>([]);
  const [data, setData] = React.useState<{
    userId: string;
    userName: string;
  }>({ userId: "", userName: "" });
  const [userList, setUserList] = React.useState<any[]>([]);
  const [overData, setOverData] = React.useState<IUserWorkInfo[]>();
  const [toastData, setToastData] = React.useState<any[]>([]);

  const getUserData = async () => {
    let data = await fetch(`http://localhost:8000/api/user`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    setData(data.user);
  };

  const getParticipantList = async () => {
    await fetch(`http://localhost:8000/api/userList`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          setUserList(res.user);
        }
      });
  };

  useEffect(() => {
    getParticipantList();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (
      ctx.ws !== null &&
      ctx.ws.current !== null &&
      ctx.ws.current!.readyState === WebSocket.OPEN
    ) {
      ctx.ws.current.addEventListener("message", (msg: any) => {
        const message = JSON.parse(msg.data);
        if (message.category === "alarm") {
          switch (message.type) {
            case "getAlarm":
              setAlarmData(message.data.filter((v: any) => v.checkAlarm));
              break;
            case "checkAlarm":
              setAlarmData(
                alarmData.filter((v) => v.alarmId !== message.data.alarmId)
              );
              break;
            case "createAlarm":
              console.log("createAlarm");

              console.log(message.data);

              // setToastData()
              break;
          }
        }
      });

      if (alarmData.length === 0) {
        ctx.ws.current!.send(
          JSON.stringify({
            category: "alarm",
            type: "getAlarmData",
          })
        );
      }
    }
  }, [ctx]);

  let uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const makeUserInfo = (data: IUserWorkInfo[]) => {
    let returnData = [];
    let idx = 0;
    for (let i of data) {
      if (idx === 5) {
        break;
      }
      if (i.userId !== ctx.session.userId) {
        returnData.push(
          <div
            key={uuidv4()}
            className={classes.userInfoData}
            style={{
              zIndex: idx,
              backgroundImage:
                i.userThumbnail === undefined
                  ? "none"
                  : ` url('http://localhost:8000/api/temp/${i.userThumbnail}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              border:
                i.userThumbnail === undefined ? "1px solid #ffffff" : "none ",
            }}
            onClick={() => {
              window.location.href = i.workInfo.workingPath;
            }}
            title={i.workInfo.workingPath}
          >
            {userList.find((v) => v.userId === i.userId)?.userThumbnail ===
              undefined && <span>{i.userId.substring(0, 1)}</span>}
          </div>
        );
      }
      idx++;
    }
    if (data.length > 5) {
      returnData.push(
        <span
          style={{ paddingLeft: "8px", fontSize: "12px" }}
          onMouseOver={() => {
            if (ctx.loginUser !== undefined && ctx.loginUser !== undefined) {
              setOverData(ctx.loginUser);
            }
          }}
        >
          {" "}
          외 {data.length - 5}명
        </span>
      );
    }
    return returnData;
  };

  return (
    <React.Fragment>
      <div className={classes.topBar}>
        <div className={classes.logo}>
          <img
            src="/images/picode-7.svg"
            alt="logo"
            style={{
              width: "40px",
              height: "40px",
              lineHeight: "50px",
              paddingRight: "8px",
            }}
          />
          <span>PICode</span>
        </div>
        <div className={classes.userInfo}>
          <IconButton
            style={{ color: theme === "dark" ? "#fff" : "#121212" }}
            onClick={() => setOpen(!open)}
          >
            <AccountCircleRoundedIcon />
          </IconButton>
        </div>
        <div className={classes.themeButton}>
          <IconButton
            onClick={() =>
              theme === "dark" ? dispatch(toWhite()) : dispatch(toDark())
            }
            style={{ color: theme === "dark" ? "#fff" : "#121212" }}
          >
            <Brightness4Icon />
          </IconButton>
        </div>
        <div className={classes.themeButton}>
          {alarmData.length > 0 && (
            <div
              style={{
                top: "10px",
                left: "30px",
                width: "10px",
                height: "10px",
                borderRadius: "10px",
                background: "red",
                position: "absolute",
              }}
            />
          )}
          <IconButton
            style={{ color: theme === "dark" ? "#fff" : "#121212" }}
            onClick={() => {
              setOpenAlert(!openAlert);
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </div>
        <div className={classes.loginUserInfo}>
          {ctx.loginUser !== undefined &&
            ctx.loginUser.length > 1 &&
            makeUserInfo(ctx.loginUser).map((v) => v)}
        </div>
      </div>
      {open === true && (
        <UserInfo open={open} setOpen={setOpen} data={data} theme={theme} />
      )}
      {openAlert && (
        <AlertDialog
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          data={alarmData}
          ctx={ctx}
        />
      )}
    </React.Fragment>
  );
}
