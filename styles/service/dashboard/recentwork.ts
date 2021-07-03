import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const recentWorkStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        recentContent: {
            width: "100%",
            height: "60%",
            minHeight: "400px",
            padding: "32px",
        },
        title: {
            fontSize: theme.font.high.size,
            color: theme.font.high.color,
            paddingBottom: "24px",
        },
        content: {
            width: "100%",
            height: "calc(100% - 66px)",
            background: theme.backgroundColor.step1,
            padding: "24px",
        },
        carousal: {
            width: "80%",
        },
    })
);
