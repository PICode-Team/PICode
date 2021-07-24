/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import { signupStyle } from "../../../styles/service/user/signup";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../../modules/theme";
import { loginStyle } from "../../../styles/service/user/login";
import { Button, IconButton, TextField } from "@material-ui/core"
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CustomButton from "../../items/input/button";
import CustomTextField from "../../items/input/textfield";
import { useEffect } from "react";
import { debounce } from "lodash"
import { emailRegex, pwRegex } from "../../constant/regex";

interface IValidate {
    email: boolean;
    pw: boolean;
}

export default function SignUp() {
    const classes = signupStyle();
    const theme = useSelector((state: any) => state.theme).theme
    const [userId, setUserId] = React.useState<string>("");
    const [userName, setUserName] = React.useState<string>("");
    const [confirmPw, setConfirmPw] = React.useState<string>("");
    const [passwd, setPasswd] = React.useState<string>("");
    const [validate, setValidate] = React.useState<IValidate>({
        email: true,
        pw: true
    });
    const dispatch = useDispatch();

    const handleEmail = (e: any) => {
        setUserId(e.target.value)
        let result = emailRegex.test(userId);
        setValidate({ ...validate, email: result });
    }

    const hadnlePw = (e: any) => {
        setPasswd(e.target.value);
        let result = pwRegex.test(passwd);
        setValidate({ ...validate, pw: result });
    }

    const submitSignUp = async () => {
        let payload = {
            userId: userId,
            userName: userName,
            passwd: passwd,
        }
        let data = await fetch(`http://localhost:8000/api/user`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
        window.location.href = "/"
    }

    return <div className={classes.root}>
        <div className={classes.themeChangeButton}>
            {theme === "dark" ? <IconButton onClick={() => dispatch(toWhite())} style={{ color: "#fff" }}>
                <Brightness7Icon />
            </IconButton> : <IconButton onClick={() => dispatch(toDark())} style={{ color: "black" }}>
                <Brightness4Icon />
            </IconButton>}
        </div>
        <div className={classes.loginForm}>
            <div className={classes.inputForm}>
                <div className={classes.subject}>
                    <span>
                        Sign Up
                    </span>
                </div>
                <div className={classes.inputBox}>
                    <CustomTextField label="Name" onChange={(e: any) => setUserName(e.target.value)} />
                    <CustomTextField label="Email" type="email" onChange={(e: any) => handleEmail(e)} error={!validate.email} errorText={"Is only Email"} />
                    <CustomTextField label="Password" type="password" onChange={(e: any) => setPasswd(e.target.value)} error={!validate.pw} errorText={"Isn't required password"} />
                    <CustomTextField label="Confirm Password" type="password" onChange={(e: any) => setConfirmPw(e.target.value)} error={passwd !== confirmPw} errorText={"Password is wrong"} />
                </div>
                <div className={classes.buttonBox} style={{ marginTop: "24px" }}>
                    <CustomButton text="Sign Up" onClick={() => {
                        if (userId === "") return;
                        if (userName === "") return;
                        if (passwd === "" || confirmPw !== passwd) return;
                        if (confirmPw === "") return;
                        submitSignUp();
                    }} />
                </div>
                <div className={classes.buttonBox}>
                    <a href="/login">If you have account&nbsp;&nbsp;→</a>
                </div>
            </div>
        </div>
    </div>
}