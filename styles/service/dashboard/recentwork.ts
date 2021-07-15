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
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
        },
        view: {
            alignContent: "center",
            width: "100%",
            position: "relative",
            overflow: "hidden",
        },
        selectView: {
            position: "absolute",
            right: "80px",
            zIndex: 2,
            color: "#fff",
        },
    })
);
