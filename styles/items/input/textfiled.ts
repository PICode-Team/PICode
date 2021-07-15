import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const textFiledStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        main: {
            backgroundColor: "transparent",
            color: theme.font.medium.color,
            width: "100%",
            height: "48px",
            marginBottom: "20px",
            borderBottom: "1px solid" + theme.font.medium.color,
            "&>div": {
                color: theme.font.medium.color,
            },
            "&>div:hover": {
                color: theme.font.medium.color,
                borderBottom: "2px solid " + theme.font.medium.color,
            },
            "&>div:after": {
                borderBottom: "1px solid " + theme.font.medium.color,
            },
            "& label.Mui-focused": {
                color: theme.font.medium.color,
            },
            "&>label": {
                color: theme.font.medium.color,
            },
        },
    })
);
