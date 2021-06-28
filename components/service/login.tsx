import { Button, InputBase } from "@material-ui/core";
import dynamic from "next/dynamic"
import React from "react"
import { loginStyle } from "../../styles/service/login";
import { TextField } from "@material-ui/core"
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

export default function Login() {
    const classes  = loginStyle();

    return (
        <div className={classes.root}>
            <div className={classes.loginForm}>
                <div className={classes.loginImage}>
                    <AccountCircleRoundedIcon style={{ width: "60%", height: "60%" }} />
                </div>
                <div className={classes.inputForm}>
                    <div className={classes.subject}>
                        <span>
                            Login
                        </span>
                    </div>
                    <div className={classes.inputBox}>
                        <TextField id="standard-basic" label="Email" />
                        <TextField id="standard-basic" label="Password" />
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