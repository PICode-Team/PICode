import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const loginStyle = makeStyles((theme: any) =>
    createStyles({
        root: {
            backgroundColor: theme.backgroundColor.step0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        loginForm: {
            backgroundColor: theme.backgroundColor.step1,
            padding: "5%",
            borderRadius: "15px",
            maxWidth: "1105px",
            maxHeight: "722px",
            width: "50%",
            height: "50%",
            display: "flex",
        },
        loginImage: {
            width: "30%",
            height: "100%",
            display: "flex",
            color: theme.font.low.color,
            alignItems: "center",
            justifyContent: "center",
        },
        inputForm: {
            width: "70%",
            display: "grid",
            color: theme.font.high.color,
            padding: "0 10%",
            verticalAlign: "middle",
            height: "100%",
        },
        subject: {
            fontSize: theme.font.high.size,
            width: "100%",
            textAlign: "center",
        },
        inputBox: {
            textAlign: "center",
            width: "100%",
        },
        buttonBox: {
            textAlign: "center",
            fontSize: theme.font.small.size,
            width: "100%",
        },
        themeChangeButton: {
            position: "absolute",
            right: "20px",
            top: "20px",
        },
    })
);
