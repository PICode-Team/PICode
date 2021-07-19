import { Button } from "@material-ui/core"
import React from "react"
import { ButtonStyle } from "../../../styles/items/input/button";

export default function CustomButton(props: any) {
    const classes = ButtonStyle();
    return <Button
        className={classes.main}
        onClick={props.onClick}
        style={{
            width: props.width ? props.width : "100%",
            height: props.height ? props.height : "48px"
        }}
    >
        {props.text}
    </Button>
}