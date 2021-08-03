/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import { newSignupStyle } from "../../../styles/service/user/signup";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../../modules/theme";
import { Button, IconButton, TextField } from "@material-ui/core";
import { emailRegex, pwRegex } from "../../constant/regex";

interface IValidate {
  email: boolean;
  pw: boolean;
}

export default function SignUp() {
  const classes = newSignupStyle();
  const theme = useSelector((state: any) => state.theme).theme;
  const [userId, setUserId] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [confirmPw, setConfirmPw] = React.useState<string>("");
  const [passwd, setPasswd] = React.useState<string>("");
  const [validate, setValidate] = React.useState<IValidate>({
    email: true,
    pw: true,
  });
  const dispatch = useDispatch();

  const handleEmail = (e: any) => {
    setUserId(e.target.value);
    let result = emailRegex.test(userId);
    setValidate({ ...validate, email: result });
  };

  const hadnlePw = (e: any) => {
    setPasswd(e.target.value);
    let result = pwRegex.test(passwd);
    setValidate({ ...validate, pw: result });
  };

  const submitSignUp = async () => {
    let payload = {
      userId: userId,
      userName: userName,
      passwd: passwd,
    };
    let data = await fetch(`http://localhost:8000/api/user`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    window.location.href = "/";
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
      <div className={classes.signup}>
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <div className={classes.title}>Sign Up</div>
            <div className={classes.input}>
              <input type="text" placeholder="name" />
            </div>
            <div className={classes.input}>
              <input type="text" placeholder="id" />
            </div>
            <div className={classes.input}>
              <input type="password" placeholder="password" />
            </div>
            <div className={classes.input}>
              <input type="password" placeholder="confirm password" />
            </div>
            <div className={classes.button}>
              <button>Sign Up</button>
            </div>
            <div className={classes.a}>
              <a href="/">Do you have an account?</a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
