import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const boardStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        header: {
            padding: "10px 40px",
            height: "50px",
            width: "100%",
            lineHeight: "20px",
            paddingLeft: "40px",
            display: "inline-block",
            position: "relative",
            fontWeight: 500,
            color: theme.font.small.color,
            fontSize: theme.font.small.size,
            "&>input": {
                width: "50%",
            },
        },
        createButton: {
            position: "absolute",
            right: "40px",
            height: "30px",
            display: "inline-flex",
            alignItems: "center",
            padding: "5px",
            cursor: "pointer",
            borderRadius: "5px",
            lineHeight: "30px",
            background: theme.backgroundColor.step1,
        },
        wrapper: {
            width: "100%",
            height: "100%",
        },
        content: {
            width: "calc(100% - 80px)",
            height: "calc(100% - 70px)",
            padding: "10px",
            margin: "0px 40px",
            background: theme.backgroundColor.step1,
        },
        kanbanItem: {
            width: "100%",
            height: "80px",
            padding: "10px",
            "&:hover": {
                background: theme.backgroundColor.step3,
                cursor: "pointer",
            },
        },
        kanbanItemContent: {
            width: "100%",
            height: "100%",
            background: theme.backgroundColor.step2,
            color: theme.font.high.color,
        },
    })
);
