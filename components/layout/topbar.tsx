import { IconButton } from "@material-ui/core";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../modules/theme";
import { TopbarStyle } from "../../styles/layout/topbar";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { useState } from "react";
import UserInfo from "./item/tooltip";

export function Topbar() {
    const theme = useSelector((state: any) => state.theme).theme
    const dispatch = useDispatch();
    const classes = TopbarStyle();
    const [open, setOpen] = React.useState<boolean>(false);
    let user = {
        id: "test@test.com",
        pw: "1234",
        name: "test"
    }

    return (
        <React.Fragment>
            <div className={classes.topBar}>
                <div className={classes.userInfo}>
                    <IconButton style={{ color: theme === "dark" ? "#fff" : "#121212" }} onClick={() => setOpen(!open)}>
                        <AccountCircleRoundedIcon />
                    </IconButton>
                </div>
                <div className={classes.themeButton}>
                    <IconButton onClick={() => theme === "dark" ? dispatch(toWhite()) : dispatch(toDark())} style={{ color: theme === "dark" ? "#fff" : "#121212" }}>
                        <Brightness4Icon />
                    </IconButton>

                </div>
            </div>
            {open === true && <UserInfo open={open} setOpen={setOpen} data={user} theme={theme} />}
        </React.Fragment >
    )
}