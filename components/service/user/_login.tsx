/* eslint-disable @next/next/no-html-link-for-pages */
import { IconButton } from "@material-ui/core";
import React from "react";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../../modules/theme";
import { newLoginStyle } from "../../../styles/service/user/login";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import CustomButton from "../../items/input/button";
import CustomTextField from "../../items/input/textfield";
import { resultType } from "../../constant/fetch/result";

export default function Login() {
  const classes = newLoginStyle();
  const theme = useSelector((state: any) => state.theme).theme;
  const [userId, setUserId] = React.useState<string>("");
  const [passwd, setPasswd] = React.useState<string>("");
  const dispatch = useDispatch();

  const submitLogin = async () => {
    let payload = {
      userId: userId,
      passwd: passwd,
    };

    let data: { code: number } = await fetch(
      `http://localhost:8000/api/user/sign`,
      {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    ).then((res) => res.json());
    window.location.reload();
  };

  return (
    <React.Fragment>
      <div className={classes.themeChangeButton}>
        {theme === "dark" ? (
          <IconButton
            onClick={() => dispatch(toWhite())}
            style={{ color: "#fff" }}
          >
            <Brightness7Icon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => dispatch(toDark())}
            style={{ color: "#414C50" }}
          >
            <Brightness4Icon />
          </IconButton>
        )}
      </div>
      <div className={classes.login}>
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <div className={classes.title}>Welcome PICode!</div>
            <div className={classes.input}>
              <input
                type="text"
                placeholder="id"
                onChange={(e: any) => setUserId(e.target.value)}
              />
            </div>
            <div className={classes.input}>
              <input
                type="password"
                placeholder="password"
                onChange={(e: any) => setPasswd(e.target.value)}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    submitLogin();
                  }
                }}
              />
            </div>
            <div className={classes.button}>
              <button
                onClick={() => {
                  if (userId === "") return;
                  if (passwd === "") return;
                  submitLogin();
                }}
              >
                Login
              </button>
            </div>
            <div className={classes.a}>
              <a href="">Forgot Username / Password?</a>
            </div>
            <div className={classes.a}>
              <a href="/signup">Create Your Account</a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
