import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const issueStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        button: {
            padding: "10px 20px",
            height: "40px",
            width: "200px",
            lineHeight: "20px",
            display: "inline-block",
            textAlign: "center",
            cursor: "pointer",
            margin: "10px",
            fontWeight: 500,
            background: theme.backgroundColor.step1,
            color: theme.font.high.color,
            fontSize: theme.font.small.size,
        },
        buttonDiv: {
            display: "flex",
            float: "right",
        },
        notSelect: {
            "&:hover": {
                color: theme.font.high.color,
                borderBottom: `3px solid ${theme.backgroundColor.step1}`,
            },
        },
    })
);
