import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const createProjectStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      padding: "32px",
    },
    header: {
      width: "100%",
      fontSize: theme.font.high.size,
      color: theme.font.high.color,
      marginBottom: "30px",
    },
    content: {
      width: "100%",
      height: "fit-content",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "5px",
    },
    optionalContent: {
      width: "100%",
      height: "fit-content",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      width: "100%",
      paddingTop: "24px",
      fontSize: theme.font.medium.size,
      color: theme.font.medium.color,
    },
    selectContent: {
      width: "100%",
      paddingTop: "16px",
      height: "100%",
      cursor: "pointer",
    },
    typeContent: {
      width: "100%",
      height: "fit-content",
    },
    typeNode: {
      width: "500px",
      height: "70px",
      display: "flex",
      minWidth: "242px",
      alignItems: "center",
      padding: "16px",
      color: theme.font.medium.color,
      background: "#3b434c",
      "&:hover": {
        background: "#4d5763",
        transition: "all 0.3s",
        color: theme.font.low.color,
      },
      "&>span": {
        paddingLeft: "12px",
      },
    },
    buttonBox: {
      display: "flex",
      width: "500px",
      justifyContent: "flex-end",
    },
    button: {
      width: "100px",
      marginTop: "6px",
      marginLeft: "12px",
      height: "32px",
      color: theme.font.high.color,
      fontSize: theme.font.small.size,
      borderRadius: "2px",
      border: "none",
      background: theme.backgroundColor.step2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&:nth-child(1)": {
        background: "#566372",
        "&:hover": {
          background: theme.backgroundColor.step3,
          transition: "all 0.3s",
        },
      },
      "&:nth-child(2)": {
        background: "#4078b8",
        "&:hover": {
          background: theme.backgroundColor.step3,
          transition: "all 0.3s",
        },
      },
    },
    inputContent: {
      width: "500px",
      "&>div": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
      },
    },

    input: {
      display: "flex",
      alignItems: "center",
      marginTop: "16px",
      "&>input": {
        width: "100%",
        background: "#3b434c",
        padding: "4px 8px",
        border: "none",
        borderRadius: "2px",
        color: theme.font.high.color,
        height: "32px",
        lineHeight: "32px",
        flex: 1,
        outline: "none",
      },
      "&>span": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
        marginRight: "8px",
        marginTop: "2px",
      },
    },
    textarea: {
      "&>textarea": {
        width: "100%",
        background: "#3b434c",
        padding: "6px 12px",
        border: "none",
        borderRadius: "2px",
        color: theme.font.high.color,
        marginTop: "8px",
        marginBottom: "14px",
        lineHeight: "17px",
        fontFamily: "Arial",
        resize: "none",
        outline: "none",
      },
      "&>span": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
      },
    },

    divider: {
      width: "100%",
      height: "41px",
      display: "flex",
      alignItems: "center",
      "&>div": {
        width: "100%",
        height: "1px",
        background: "#505050",
      },
    },
    subTitle: {
      color: "#ffffff",
      marginBottom: "10px",
    },

    imageUpload: {
      height: "150px",
      width: "100%",
      marginTop: "4px",
      marginBottom: "14px",
      border: `1px solid ${theme.font.small.color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.font.high.color,
    },

    stepper: {
      display: "flex",
      alignItems: "center",
      margin: "30px 0px",
      marginBottom: "75px",
      width: "120vh",
      justifyContent: "center",
    },
    step: {
      width: "24px",
      height: "24px",
      borderRadius: "15px",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      fontWeight: "bold",
      paddingTop: "24px",
    },
    lail: {
      width: "30%",
      height: "1px",
      backgroundColor: "rgba(255, 255, 255, 0.55)",
      margin: "0px 10px",
    },
    active: {
      backgroundColor: "#90CAF9",
    },
    stepNumber: {
      paddingTop: "6px",
      paddingBottom: "10px",
      fontSize: "12px",
      "&>svg": {
        paddingTop: "2px",
        width: "18px",
        height: "18px",
      },
    },
    stepText: {
      whiteSpace: "nowrap",
      paddingLeft: "5px",
      fontSize: "14px",
      fontWeight: "normal",
      color: "rgba(255, 255, 255, 0.55)",
    },

    createWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#2c3239",
      padding: "30px",
      height: "calc(100% - 75px)",
    },
  })
);
