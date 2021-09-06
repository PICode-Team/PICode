/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { IconButton } from "@material-ui/core";
import React from "react"
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../../modules/theme";
import { loginStyle } from "../../../styles/service/user/login";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CustomButton from "../../items/input/button";
import CustomTextField from "../../items/input/textfield";
import { resultType } from "../../constant/fetch/result";

export default function Login() {
    const classes = loginStyle();
    const theme = useSelector((state: any) => state.theme).theme
    const [userId, setUserId] = React.useState<string>("");
    const [passwd, setPasswd] = React.useState<string>("");
    const dispatch = useDispatch();

    const submitLogin = async () => {
        let payload = {
            userId: userId,
            passwd: passwd
        }

        let data: { code: number; } = await fetch(`http://localhost:8000/api/user/sign`, {
            method: "POST",
            mode: "cors",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
        window.location.reload()
    }

    return (
        <div className={classes.root}>
            <div className={classes.themeChangeButton}>
                {theme === "dark" ? <IconButton onClick={() => dispatch(toWhite())} style={{ color: "#fff" }}>
                    <Brightness7Icon />
                </IconButton> : <IconButton onClick={() => dispatch(toDark())} style={{ color: "#414C50" }}>
                    <Brightness4Icon />
                </IconButton>}
            </div>
            <div className={classes.loginForm}>
                <div style={{ width: "100%", height: "449px", textAlign: "center" }}>
                    <img src={"http://localhost:8000/images/picode-7.svg"} width={"110px"} draggable={false} />
                    <div className={classes.titleText}>
                        PICODE
                    </div>
                    <div style={{ marginTop: "50px" }}>
                        <CustomTextField
                            label="ID"
                            onChange={(e: any) => setUserId(e.target.value)} />
                        <CustomTextField
                            label="PW"
                            type="password"
                            onChange={(e: any) => setPasswd(e.target.value)}
                            onKeyPress={(e: any) => {
                                if (e.key === "Enter") {
                                    submitLogin();
                                }
                            }}
                        />
                        <div
                            className={classes.button}
                            style={{ marginTop: "40px" }}
                            onClick={() => {
                                if (userId === "") return;
                                if (passwd === "") return;
                                submitLogin();
                            }}>
                            Login
                        </div>
                        <div className={classes.signUpbutton} style={{ marginTop: "20px" }}>
                            If you don't have a account, <a href="/signup" style={{ color: "#609FF3" }}>Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}