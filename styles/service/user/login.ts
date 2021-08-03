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
      backgroundColor: theme.backgroundColor.step1,
      padding: "5%",
      borderRadius: "15px",
      maxWidth: "1105px",
      maxHeight: "722px",
      width: "50%",
      height: "50%",
      display: "flex",
      justifyContent: "center",
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
    inputForm: {
      width: "60%",
      display: "grid",
      color: theme.font.high.color,
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
