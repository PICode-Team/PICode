import { TextField } from "@material-ui/core"
import React from "react"
import { textFiledStyle } from "../../../styles/items/input/textfiled";

export default function CustomTextField(props: any) {
    const classes = textFiledStyle();
    return <TextField
        label={props.label && props.label}
        className={classes.main}
        type={props.type}
        onChange={props.onChange}
        error={props.error}
        onKeyPress={props.onKeyPress}
        helperText={props.error ? props.errorText : ""}
        style={{
            width: props.width ? props.width : "100%",
            height: props.height ? props.height : "48px",
        }}
    />
}