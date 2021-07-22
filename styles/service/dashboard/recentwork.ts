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
        menuDialog: {
            position: "absolute",
            width: "200px",
            right: "200px",
            top: "30px",
            height: "250px",
            background: theme.backgroundColor.step2,
            color: theme.font.high.color,
            zIndex: 3,
            overflow: "hidden",
            overflowY: "scroll",
            borderRadius: "2px",
        },
        menuDialogRow: {
            width: "100%",
            padding: "8px",
            cursor: "pointer",
            "&:hover": {
                background: theme.backgroundColor.step3,
                transition: "all 0.3s",
            },
        },
        leftButton: {
            position: "absolute",
            top: "45%",
            zIndex: 2,
            left: "10px",
            color: theme.font.high.color,
        },
        rightButton: {
            position: "absolute",
            right: "10px",
            top: "45%",
            zIndex: 2,
            color: theme.font.high.color,
        },
        dropDown: {
            position: "absolute",
            right: "190px",
            width: "30px",
            top: "3px",
            height: "30px",
            color: theme.font.high.color,
            zIndex: 3,
        },
    })
);
