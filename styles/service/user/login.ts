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
