/* eslint-disable @next/next/no-html-link-for-pages */
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

export default function Login() {
    const classes = loginStyle();
    const theme = useSelector((state: any) => state.theme).theme
    const [id, setId] = React.useState<string>("");
    const [pw, setPw] = React.useState<string>("");
    const dispatch = useDispatch();

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
                <div className={classes.loginImage}>
                    <AccountCircleRoundedIcon style={{ width: "60%", height: "100%", minWidth: "140px" }} />
                </div>

                <div className={classes.inputForm}>
                    <div className={classes.subject}>
                        <span>
                            Login
                        </span>
                    </div>
                    <div className={classes.inputBox}>
                        <CustomTextField label="Email" type="email" onChange={(e: any) => setId(e.target.value)} />
                        <CustomTextField label="Password" type="password" onChange={(e: any) => setPw(e.target.value)} onKeyPress={(e: any) => {
                            if (e.key === "Enter") {
                                window.location.href = "/"
                            }
                        }} />
                    </div>
                    <div className={classes.buttonBox}>
                        <CustomButton text="login" onClick={() => {
                            if (id === "") return;
                            if (pw === "") return;
                            let serverData: any = JSON.parse(localStorage.getItem("user") as any)
                            if (id === serverData.id && pw === serverData.pw) {
                                window.location.href = "/"
                            }
                        }} />
                        <a href="#">Forgot Username / Password?</a>
                    </div>
                    <div className={classes.buttonBox}>
                        <a href="/signup">Create Your Account&nbsp;&nbsp;→</a>
                    </div>
                </div>
            </div>
        </div>
    )

}