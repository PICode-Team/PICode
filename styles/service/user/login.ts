import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const loginStyle = makeStyles((theme: IThemeStyle) =>
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
            backgroundColor: theme.loginBackground,
            width: "460px",
            height: "680px",
            display: "flex",
            justifyContent: "center",
            padding: "100px 60px",
            // borderRadius: "20px",
        },
        loginImage: {
            width: "40%",
            height: "100%",
            display: "flex",
            color: theme.font.low.color,
            alignItems: "center",
            "@media (max-width: 1183px)": {
                display: "none",
            },
        },
        themeChangeButton: {
            position: "absolute",
            right: "20px",
            top: "20px",
        },
        titleText: {
            marginTop: "5px",
            height: "32px",
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "28px",
            lineHeight: "32px",
            color: theme.font.high.color,
        },
        input: {
            border: "none",
            borderBottom: `2px solid ${theme.font.medium.color}`,
            background: theme.backgroundColor.step1,
            height: "35px",
            lineHeight: "40px",
            textAlign: "left",
            fontSize: "15px",
            padding: "10px 5px",
            color: theme.font.high.color,
            transition: "0.3s",
            width: "100%",
            "&:focus": {
                outline: "none",
                borderBottom: `2px solid #609FF3`,
            },
            "&:hover": {
                transition: "0.3s",
                borderBottom: "2px solid #609FF3",
            },
        },
        button: {
            width: "100%",
            height: "40px",
            background: "#609FF3",
            lineHeight: "40px",
            borderRadius: 4, //30
            fontSize: "18px",
            transition: "0.3s",
            color: theme.font.high.color,
            cursor: "pointer",
            "&:hover": {
                transition: "0.3s",
                background: "#217BF4",
            },
        },
        signUpbutton: {
            color: theme.font.low.color,
            "&>a": {
                color: "#609FF3",
                transition: "0.3s",
                "&:hover": {
                    transition: "0.3s",
                    color: "#217BF4",
                },
            },
        },
    })
);

export const newLoginStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        login: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step0,
        },
        container: {
            maxWidth: "450px",
            width: "100%",
            height: "100%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        wrapper: {
            width: "100%",
            padding: "45px",
            backgroundColor: theme.backgroundColor.step1,
            borderRadius: "4px",
        },
        title: {
            color: theme.font.high.color,
            fontSize: "32px",
            textAlign: "center",
            marginBottom: "26px",
            fontWeight: "bold",
        },
        input: {
            marginBottom: "20px",
            "&>input": {
                width: "100%",
                height: "40px",
                backgroundColor: theme.backgroundColor.step2,
                color: theme.font.high.color,
                border: "none",
                outline: "none",
                borderRadius: "3px",
                padding: "0px 12px",
                fontSize: "15px",
            },
        },
        button: {
            width: "100%",
            marginBottom: "20px",
            "&>button": {
                width: "100%",
                height: "40px",
                backgroundColor: theme.backgroundColor.step3,
                color: theme.font.high.color,
                border: "none",
                outline: "none",
                fontSize: "15px",
                cursor: "pointer",
                borderRadius: "3px",
                transition: "ease-in 0.2s background-color",
                "&:hover": {
                    backgroundColor: theme.backgroundColor.step4,
                },
            },
        },
        a: {
            textAlign: "center",
            fontSize: theme.font.small.size,
            width: "100%",
            color: theme.font.high.color,
            marginBottom: "1px",
            "&:hover": {
                textDecoration: "underline",
            },
        },

        themeChangeButton: {
            position: "absolute",
            right: "20px",
            top: "20px",
        },
    })
);
