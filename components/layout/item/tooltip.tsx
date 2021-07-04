import React from "react";
import { UserInfoStyle } from "../../../styles/layout/item/tooltip";
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { IconButton } from "@material-ui/core";
import CustomButton from "../../items/input/button";

export default function UserInfo(props: any) {
    const classes = UserInfoStyle();
    return <div className={classes.userInfo}>
        <div className={classes.topbar}>
            <IconButton style={{ color: props.theme === "dark" ? "#fff" : "#121212" }} onClick={() => props.setOpen(false)}>
                <ClearRoundedIcon />
            </IconButton>
        </div>
        <div className={classes.content}>
            <AccountCircleRoundedIcon style={{ width: "50%", height: "50%", color: props.theme === "dark" ? "#fff" : "#121212" }} />
            <div className={classes.contentText}>
                Hello, {props.data.name}
            </div>
            <div className={classes.logout}>
                <CustomButton text={"logout"} height={"24px"} width={"50%"} onClick={() => {
                    window.location.href = "/login"
                }} />
            </div>
        </div>
    </div>
}