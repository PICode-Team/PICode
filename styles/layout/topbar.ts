import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const TopbarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        topBar: {
            backgroundColor: theme.backgroundColor.step2,
            width: "100%",
            height: "70px",
        },
        themeButton: {
            lineHeight: "70px",
            float: "right",
            display: "inline-block",
            color: theme.font.high.color,
        },
        userInfo: {
            lineHeight: "70px",
            display: "inline-block",
            float: "right",
            marginRight: "20px",
            color: theme.font.high.color,
        },
    })
);
