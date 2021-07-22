import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const createProjectStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "100%",
            padding: "32px",
        },
        header: {
            width: "100%",
            fontSize: theme.font.high.size,
            color: theme.font.high.color,
        },
        content: {
            width: "100%",
            height: "fit-content",
            maxHeight: "100%",
        },
        title: {
            width: "100%",
            paddingTop: "24px",
            fontSize: theme.font.medium.size,
            color: theme.font.medium.color,
        },
        selectContent: {
            width: "33%",
            paddingTop: "16px",
            height: "100%",
            cursor: "pointer",
        },
        typeContent: {
            width: "100%",
            height: "fit-content",
        },
        typeNode: {
            width: "100%",
            height: "70px",
            display: "flex",
            minWidth: "242px",
            alignItems: "center",
            padding: "16px",
            color: theme.font.medium.color,
            background: theme.backgroundColor.step2,
            "&:hover": {
                background: theme.backgroundColor.step3,
                transition: "all 0.3s",
                color: theme.font.low.color,
            },
            "&>span": {
                paddingLeft: "12px",
            },
        },
        buttonBox: {
            display: "flex",
            width: "500px",
            justifyContent: "flex-end",
        },
        button: {
            width: "100px",
            marginTop: "6px",
            marginLeft: "12px",
            height: "32px",
            color: theme.font.high.color,
            fontSize: theme.font.small.size,
            borderRadius: "2px",
            border: `1px solid ${theme.font.low.color}`,
            background: theme.backgroundColor.step2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
                background: theme.backgroundColor.step3,
                transition: "all 0.3s",
            },
        },
        inputContent: {
            width: "500px",
            paddingTop: "16px",
            "&>input": {
                width: "100%",
                background: "inherit",
                marginTop: "4px",
                paddingLeft: "4px",
                border: `1px solid ${theme.font.small.color}`,
                borderRadius: "2px",
                color: theme.font.high.color,
                marginBottom: "12px",
                height: "32px",
                lineHeight: "32px",
            },
            "&>textarea": {
                width: "100%",
                background: "inherit",
                marginTop: "4px",
                paddingLeft: "4px",
                border: `1px solid ${theme.font.small.color}`,
                borderRadius: "2px",
                color: theme.font.high.color,
                marginBottom: "14px",
                lineHeight: "17px",
                fontFamily: "Arial",
                resize: "none",
            },
            "&>span": {
                color: theme.font.high.color,
                fontSize: theme.font.small.size,
            },
        },
        imageUpload: {
            height: "150px",
            width: "100%",
            marginTop: "4px",
            marginBottom: "14px",
            border: `1px solid ${theme.font.small.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.font.high.color,
        },
    })
);
