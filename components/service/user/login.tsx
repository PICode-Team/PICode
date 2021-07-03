import { Button, IconButton, InputBase } from "@material-ui/core";
import dynamic from "next/dynamic"
import React from "react"
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../../modules/theme";
import { loginStyle } from "../../../styles/service/login";
import { TextField } from "@material-ui/core"
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

export default function Login() {
    const classes = loginStyle();
    const theme = useSelector((state: any) => state.theme).theme
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            <div className={classes.themeChangeButton}>
                {theme === "dark" ? <IconButton onClick={() => dispatch(toWhite())} style={{ color: "#fff" }}>
                    <Brightness7Icon />
                </IconButton> : <IconButton onClick={() => dispatch(toDark())} style={{ color: "black" }}>
                    <Brightness4Icon />
                </IconButton>}
            </div>
            <div className={classes.loginForm}>
                <div className={classes.loginImage}>
                    <AccountCircleRoundedIcon style={{ width: "100%", height: "100%" }} />
                </div>

                <div className={classes.inputForm}>
                    <div className={classes.subject}>
                        <span>
                            Login
                        </span>
                    </div>
                    <div className={classes.inputBox}>
                        <TextField id="standard-basic" label="Email" style={{ width: "70%" }} />
                        <TextField id="standard-basic" label="Password" style={{ width: "70%" }} type="password" />
                    </div>
                    <div className={classes.buttonBox}>
                        <Button style={{ width: "100%", paddingBottom: "5%" }}>Login</Button>
                        <a href="#">Forgot Username / Password?</a>
                    </div>
                    <div className={classes.buttonBox}>
                        <a href="#">Create Your Account</a>
                    </div>
                </div>
            </div>
        </div>
    )

}