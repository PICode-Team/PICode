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
import { emailRegex, pwRegex } from "../../regex";

interface IValidate {
    email: boolean;
    pw: boolean;
}

export default function SignUp() {
    const classes = signupStyle();
    const theme = useSelector((state: any) => state.theme).theme
    const [id, setId] = React.useState<string>("");
    const [name, setName] = React.useState<string>("");
    const [confirmPw, setConfirmPw] = React.useState<string>("");
    const [pw, setPw] = React.useState<string>("");
    const [validate, setValidate] = React.useState<IValidate>({
        email: true,
        pw: true
    });
    const dispatch = useDispatch();

    const handleEmail = (e: any) => {
        setId(e.target.value)
        let result = emailRegex.test(id);
        setValidate({ ...validate, email: result });
    }

    const hadnlePw = (e: any) => {
        setPw(e.target.value);
        let result = pwRegex.test(pw);
        setValidate({ ...validate, pw: result });
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
                    <CustomTextField label="Name" onChange={(e: any) => setName(e.target.value)} />
                    <CustomTextField label="Email" type="email" onChange={(e: any) => handleEmail(e)} error={!validate.email} errorText={"Is only Email"} />
                    <CustomTextField label="Password" type="password" onChange={(e: any) => setPw(e.target.value)} error={!validate.pw} errorText={"Isn't required password"} />
                    <CustomTextField label="Confirm Password" type="password" onChange={(e: any) => setConfirmPw(e.target.value)} error={pw !== confirmPw} errorText={"Password is wrong"} />
                </div>
                <div className={classes.buttonBox} style={{ marginTop: "24px" }}>
                    <CustomButton text="Sign Up" onClick={() => {
                        if (id === "") return;
                        if (name === "") return;
                        if (pw === "" || confirmPw !== pw) return;
                        if (confirmPw === "") return;
                        localStorage.setItem("user", JSON.stringify({ id: id, pw: pw, name: name }))
                        window.location.href = "/login"
                    }} />
                </div>
                <div className={classes.buttonBox}>
                    <a href="/login">If you have account&nbsp;&nbsp;→</a>
                </div>
            </div>
        </div>
    </div>
}