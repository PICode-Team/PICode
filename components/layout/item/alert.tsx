import { IconButton } from "@material-ui/core";
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import React from "react";
import { alertDialogStyle } from "../../../styles/layout/item/alert";

export default function AlertDialog(props: any) {
    const classes = alertDialogStyle();
    return <div className={classes.content}>
        <div className={classes.header}>
            Recent Alarm
            <IconButton onClick={() => {
                props.setOpenAlert(false);
            }}>
                <ClearRoundedIcon />
            </IconButton>
        </div>
        <div className={classes.alarmContent}>
            {props.data !== undefined && props.data.map((v: any) => {
                return <div key={v.content} style={{ borderBottom: "1px solid #fff", borderTop: "1px solid #fff" }}>
                    {v.content}
                </div>
            })}
        </div>
    </div>
}