import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const noteStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            position: "relative",

            display: "flex",
            background: theme.backgroundColor.step1,
        },
        fileView: {
            width: "300px",
            height: "100%",
            display: "inline-block",
            background: theme.backgroundColor.step3,
            color: theme.font.high.color,
        },
        content: {
            width: "calc(100% - 300px)",
            display: "inline-block",
            height: "100%",
            paddingTop: "24px",
        },
        leftTool: {
            width: "60px",
            color: theme.font.high.color,
            display: "inline-block",
            height: "16px",
            visibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            "&:hover": {
                visibility: "visible",
            },
        },
        iconButtonColor: {
            width: "20px",
            height: "20px",
            color: theme.font.high.color,
        },
        write: {
            color: theme.font.high.color,
            paddingLeft: "60px",
            display: "inline-block",
            width: "100%",
            height: "fit-content",
        },
        title: {
            width: "100%",
            height: "230px",
            textAlign: "center",
        },
        titleContent: {
            color: theme.font.high.color,
            height: "200px",
            width: "50%",
            display: "inline-block",
            textAlign: "left",
        },
        writeRoot: {
            width: "100%",
            height: "calc(100% - 230px)",
            textAlign: "center",
        },
        writeContent: {
            borderTop: `1px solid ${theme.font.high.color}`,
            width: "calc(50% + 60px)",
            display: "inline-block",
            height: "100%",
            marginLeft: "-60px",
            cursor: "text",
        },
        defaultTitle: {
            color: theme.font.high.color,
            background: "inherit",
            border: "none",
            "&:focus": {
                border: "none",
                outline: "none",
            },
            resize: "none",
            height: "auto",
            overflowWrap: "break-word",
            width: "100%",
            fontSize: "14px",
            padding: "8px 0",
            overflowaY: "hidden",
            boxSizing: "border-box",
        },
        defaultInput: {
            background: "inherit",
            border: "none",
            "&:focus": {
                border: "none",
                outline: "none",
            },
            lineHeight: "22px",
            textAlign: "left",
            resize: "none",
            minHeight: "22px",
            height: "fit-content",
            overflowWrap: "break-word",
            width: "100%",
            fontSize: "14px",
            overflowY: "hidden",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            "&:empty:before": {
                content: "attr(placeholder)",
                display: "inline-block",
            },
        },
        h1Input: {
            fontSize: "28px",
            fontWeight: 700,
            padding: "18px 0",
        },
        h2Input: {
            fontSize: "21px",
            fontWeight: 700,
            padding: "17px 0",
        },
        h3Input: {
            fontSize: "16px",
            fontWeight: 700,
            padding: "16px 0",
        },
        mouseOver: {
            "&:hover": {
                background: "black",
            },
        },
        settingTool: {
            background: theme.backgroundColor.step2,
            fontSize: theme.font.small.size,
            width: "100px",
            height: "fit-content",
            zIndex: 3,
            position: "absolute",
        },
        settingLine: {
            display: "flex",
            width: "100%",
            padding: "2.5px 10px",
            justifyContent: "space-between",
            alignContent: "center",
            height: "25px",
            lineHeight: "20px",
        },
        settingButton: {
            border: "none",
            background: "inherit",
            cursor: "pointer",
        },
        clicked: {
            background: theme.backgroundColor.step4,
        },
        fileRow: {
            display: "flex",
            position: "relative",
            lineHeight: "30px",
            height: "30px",
            cursor: "pointer",
            "&:hover": {
                color: theme.font.low.color,
                background: theme.backgroundColor.step4,
            },
        },
        fileEdit: {
            height: "22px",
            width: "100%",
            position: "relative",
        },
        buttonColor: {
            color: theme.font.low.color,
        },
        iconButton: {
            position: "absolute",
            right: 0,
            padding: 0,
            height: "30px",
            paddingRight: "12px",
        },
    })
);
