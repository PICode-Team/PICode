import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const containerStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            padding: "20px 24px",
        },
        content: {
            width: "100%",
            height: "100%",
            background: theme.backgroundColor.step1,
            position: "relative",
        },
        buttonWrapper: {
            position: "absolute",
            bottom: 0,
            height: "fit-content",
            width: "60px",
            padding: "10px",
        },
        buttonContent: {
            background: theme.backgroundColor.step2,
            width: "100%",
            height: "100%",
            color: theme.font.high.color,
            boxShadow: "0 5px 5px rgba(0, 0, 0, 0.2)",
            border: `1px solid ${theme.backgroundColor.step3}`,
        },
        button: {
            width: "20px",
            height: "20px",
            color: theme.font.high.color,
        },
        buttonHolder: {
            padding: 0,
            width: "40px",
            height: "40px",
        },
        divideLine: {
            width: "100%",
            height: "1px",
            background: theme.backgroundColor.step3,
        },
        context: {
            width: "150px",
            height: "160px",
            position: "absolute",
            background: theme.backgroundColor.step2,
            zIndex: 99,
            boxShadow: "0 5px 5px rgba(0, 0, 0, 0.2)",
            padding: "5px",
            color: theme.font.high.color,
        },
        icon: {
            color: theme.font.high.color,
        },
    })
);
