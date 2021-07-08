import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const UserInfoStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        userInfo: {
            position: "absolute",
            zIndex: 3,
            right: "43px",
            top: "35px",
            backgroundColor: theme.backgroundColor.step4,
            width: "200px",
            height: "300px",
            borderRadius: "12px",
        },
        topbar: {
            float: "right",
        },
        content: {
            marginTop: "48px",
            textAlign: "center",
            height: "252px",
            width: "100%",
        },
        contentText: {
            fontSize: "14px",
            marginTop: "12px",
            width: "100%",
            color: theme.font.high.color,
        },
        logout: {
            width: "100%",
            marginTop: "24px",
        },
    })
);
