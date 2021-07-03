import { IconButton } from "@material-ui/core";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../modules/theme";
import { TopbarStyle } from "../../styles/layout/topbar";

export function Topbar() {
    const theme = useSelector((state: any) => state.theme).theme
    const dispatch = useDispatch();
    const classes = TopbarStyle();
    return (
        <div className={classes.topBar}>
            <div className={classes.themeButton}>
                {theme === "dark" ? <IconButton onClick={() => dispatch(toWhite())} style={{ color: "#fff" }}>
                    <Brightness7Icon />
                </IconButton> : <IconButton onClick={() => dispatch(toDark())} style={{ color: "#ffffff" }}>
                    <Brightness4Icon />
                </IconButton>}
            </div>
        </div>
    )
}