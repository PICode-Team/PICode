import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const issueStyle = makeStyles((theme: IThemeStyle) =>
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
            background: theme.backgroundColor.step1,
        },
        content: {
            width: "calc(100% - 80px)",
            height: "calc(100% - 70px)",
            padding: "10px",
            margin: "0px 40px",
            background: theme.backgroundColor.step1,
        },
    })
);
