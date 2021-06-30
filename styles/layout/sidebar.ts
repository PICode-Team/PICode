import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const sidebarStyle = makeStyles((theme: any) =>
  createStyles({
    sidebarWrapper: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.backgroundColor.step1,
    },
    sideBar: {
      width: "200px",
      height: "calc(100% - 64px)",
      transition: "all ease-in 0.4s",
    },
    toggle: {
      width: "64px",
    },
    toggleButton: {
      width: "64px",
      height: "64px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&>svg": {
        color: theme.font.medium.color,
        width: "34px",
        height: "34px",
      },
    },
  })
);

export const rowStyle = makeStyles((theme: any) =>
  createStyles({
    row: {
      width: "100%",
      height: "50px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      textDecoration: "none",
      lineHeight: "50px",
      cursor: "pointer",
      fontSize: theme.font.low.size,
      color: theme.font.medium.color,
      transition: "all ease-in 0.4s",
      "&>svg": {
        marginRight: "8px",
        marginBottom: "2px",
      },
    },
    text: {
      whiteSpace: "nowrap",
    },
    hidden: {
      display: "none",
    },
    toggle: {
      width: "64px",
      justifyContent: "center",
      paddingLeft: "0px",
    },
  })
);
