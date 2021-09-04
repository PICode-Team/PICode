import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const manageStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    title: {
      fontSize: theme.font.high.size,
      color: theme.font.high.color,
      padding: "15px",
      display: "flex",
    },
    content: {
      width: "100%",
      height: "calc(100% - 91px)",
      padding: "24px",
      paddingTop: 0,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
    },
    projectContent: {
      width: "100%",
      background: theme.backgroundColor.step2,
      height: "100%",
    },
    projectHeader: {
      width: "100%",
      height: "50px",
      paddingLeft: "40px",
      borderBottom: `3px solid ${theme.backgroundColor.step3}`,
      display: "flex",
      alignItems: "center",
    },
    headerMenu: {
      padding: "10px 20px",
      height: "50px",
      lineHeight: "35px",
      display: "inline-block",
      cursor: "pointer",
      fontWeight: 500,
      color: theme.font.small.color,
      fontSize: theme.font.low.size,
    },
    makeLine: {
      color: theme.font.high.color,
      borderBottom: `3px solid rgba(255, 255, 255, 0.6)`,
    },
    notSelect: {
      "&:hover": {
        color: theme.font.high.color,
        borderBottom: `3px solid rgba(255, 255, 255, 0.3)`,
      },
    },
    manageContent: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      height: "calc(100% - 60px)",
      padding: "20px",
    },
    search: {
      width: "30%",
      height: "28px",
      backgroundColor: "#434D59",
      borderRadius: "20px",
      display: "flex",
      padding: "0px 12px",
      alignItems: "center",
      "&>svg": {
        color: "#ffffff",
        marginRight: "6px",
        width: "16px",
        height: "16px",
        cursor: "pointer",
      },
      "&>input": {
        backgroundColor: "inherit",
        outline: "none",
        border: "none",
        color: "#ffffff",
        marginTop: "2px",
        "&::placeholder": {
          color: "rgba(183, 183, 183, 0.42)",
          fontSize: "14px",
        },
      },
    },
    button: {
      width: "100px",
      marginLeft: "12px",
      height: "28px",
      color: theme.font.high.color,
      fontSize: "15px",
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
          background: "#647487",
          transition: "all 0.3s",
        },
      },
      "&:nth-child(2)": {
        background: "#4078b8",
        "&:hover": {
          background: "#488cd9",
          transition: "all 0.3s",
        },
      },
    },
  })
);
