/* eslint-disable @next/next/no-img-element */
import { IconButton } from "@material-ui/core";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../modules/theme";
import { TopbarStyle } from "../../styles/layout/topbar";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import UserInfo from "./item/tooltip";
import { useEffect } from "react";
import socket from "ws"


export function Topbar(ctx: any) {
    const theme = useSelector((state: any) => state.theme).theme
    const dispatch = useDispatch();
    const classes = TopbarStyle();
    const [open, setOpen] = React.useState<boolean>(false);
    const [data, setData] = React.useState<{
        userId: string;
        userName: string;
    }>({ userId: "", userName: "" });

    const getUserData = async () => {
        let data = await fetch(`http://localhost:8000/api/user`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json())
        setData(data.user)
    }

    const getLoginUserData = () => {
        let ws = new socket("ws://localhost:8000/ws")
        ws.onopen = () => {
            console.log("connect")
        }
    }

    useEffect(() => {
        getUserData();
    }, [])

    return (
        <React.Fragment>
            <div className={classes.topBar}>
                <div className={classes.logo}>
                    <img src="/images/picode-7.svg" alt="logo" style={{ width: "40px", height: "40px", lineHeight: "50px", paddingRight: "8px" }} />
                    <span>PICode</span>
                </div>
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
            {open === true && <UserInfo open={open} setOpen={setOpen} data={data} theme={theme} />}
        </React.Fragment >
    )
}