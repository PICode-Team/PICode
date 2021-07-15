import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const confirmStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },
    wrapper: {
      backgroundColor: theme.backgroundColor.step1,
      width: "30%",
      height: "70%",
      marginTop: "7.5%",
      display: "flex",
      flexDirection: "column",
      padding: "45px",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    body: {
      borderTop: "1px solid #ffffff",
      borderBottom: "1px solid #ffffff",
      padding: "30px 0px",
      marginBottom: "30px",
    },
    footer: {
      textAlign: "center",
    },
    title: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "28px",
      color: "#CFCFCF",
      marginBottom: "40px",
      "&>svg": {
        marginRight: "4px",
        width: "32px",
        height: "32px",
      },
    },
    headerContent: {
      textAlign: "left",
      color: "#CFCFCF",
    },
    description: {
      textAlign: "left",
      color: "#CFCFCF",
      marginBottom: "20px",
    },
    descriptionTitle: {
      marginBottom: "10px",
    },
    descriptionContent: {
      marginBottom: "25px",
    },
    bodyContent: {
      textAlign: "center",
      margin: "30px 0",
    },
    user: {
      width: "50px",
      height: "50px",
      marginRight: "12px",
    },
    userWrapper: {
      display: "flex",
      justifyContent: "center",
    },
    userText: {
      color: "#CFCFCF",
      marginBottom: "15px",
    },
  })
);
