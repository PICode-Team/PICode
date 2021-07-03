import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toWhite } from "../../modules/theme";
import { TopbarStyle } from "../../styles/layout/topbar";

export function Topbar() {
    const theme = useSelector((state: any) => state.theme)
    const dispatch = useDispatch();
    const classes = TopbarStyle();
    return (
        <div className={classes.topBar}>
            <button onClick={() => {
                dispatch(toWhite())
            }}>
                white
            </button>
            <button onClick={() => {
                dispatch(toDark())
            }}>
                dark
            </button>
        </div>
    )
}