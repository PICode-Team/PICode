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
import UserInfo from "./item/tooltip";
import { useEffect } from "react";
import { ISocket } from ".";

interface IUserWorkInfo {
  userId: string;
  workInfo: ISocket;
}

export function Topbar(ctx: any) {
  const theme = useSelector((state: any) => state.theme).theme;
  const dispatch = useDispatch();
  const classes = TopbarStyle();
  const [open, setOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<{
    userId: string;
    userName: string;
  }>({ userId: "", userName: "" });

  const [overData, setOverData] = React.useState<IUserWorkInfo[]>();

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

  useEffect(() => {
    getUserData();
  }, []);

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
            className={classes.userInfoData}
            style={{ zIndex: idx }}
            onClick={() => {
              window.location.href = i.workInfo.workingPath;
            }}
            title={i.workInfo.workingPath}
            onMouseOver={() => {
              if (ctx.loginUser !== undefined && ctx.loginUser !== undefined) {
                setOverData([i]);
              }
            }}
          >
            <span>{i.userId.substring(0, 1)}</span>
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
        <div className={classes.loginUserInfo}>
          {ctx.loginUser !== undefined &&
            ctx.loginUser.length > 1 &&
            makeUserInfo(ctx.loginUser).map((v) => v)}
        </div>
      </div>
      {open === true && (
        <UserInfo open={open} setOpen={setOpen} data={data} theme={theme} />
      )}
    </React.Fragment>
  );
}
