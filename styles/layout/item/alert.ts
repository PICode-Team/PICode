import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const alertDialogStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        content: {
            width: "300px",
            height: "400px",
            position: "absolute",
            background: theme.backgroundColor.step4,
            zIndex: 4,
            right: "185px",
            top: "30px",
            padding: "10px",
        },
        header: {
            width: "100%",
            height: "30px",
            fontSize: "18px",
            lineHeight: "30px",
            color: theme.font.high.color,
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
        },
        alarmContent: {
            width: "100%",
            height: "calc(100% - 30px)",
        },
    })
);
