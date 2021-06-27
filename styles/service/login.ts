import { makeStyles } from "@material-ui/styles"
import createStyles from "@material-ui/styles/createStyles"
import { darkThemeColor, whiteThemeColor } from "../color"

export const loginStyle = (ctx: any) => {
    return makeStyles(() => createStyles({
        root: {
            backgroundColor: ctx === "dark" ? darkThemeColor.backgroundColor.step0 : whiteThemeColor.backgroundColor.step0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        loginForm: {
            backgroundColor: "dark" ? darkThemeColor.backgroundColor.step1 : whiteThemeColor.backgroundColor.step1,
            borderRadius: "15px",
            maxWidth: "1105px",
            maxHeight: "722px",
            width: "70%",
            height: "50%",
            display: "flex"
        },
        loginImage: {
            width: "40%",
            height: "100%",
            display: "flex",
            color: "dark" ? darkThemeColor.font.low.color : whiteThemeColor.font.low.color,
            alignItems: "center",
            justifyContent: "center",
        }, inputForm: {
            width: "60%",
            display: "grid",
            color: "dark" ? darkThemeColor.font.high.color : whiteThemeColor.font.high.color,
            padding: "10%",
            verticalAlign: "middle",
            height: "100%"
        }, subject: {
            fontSize: "dark" ? darkThemeColor.font.high.size : whiteThemeColor.font.high.size,
            width: "100%",
            textAlign: "center",
        }, inputBox: {
            textAlign: "center",
            width: "100%",
        }, buttonBox: {
            textAlign: "center",
            fontSize: "dark" ? darkThemeColor.font.small.size : whiteThemeColor.font.low.size,
            width: "100%",
        }
    }))
}