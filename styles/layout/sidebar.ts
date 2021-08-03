import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const sidebarStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    sidebarWrapper: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.backgroundColor.step1,
      position: "sticky",
      top: 0,
    },
    sideBar: {
      width: "200px",
      height: "calc(100% - 64px)",
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

export const rowStyle = makeStyles((theme: IThemeStyle) =>
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
      "&>svg": {
        position: "absolute",
        left: 20,
      },
    },
    text: {
      whiteSpace: "nowrap",
      marginLeft: "34px",
    },
    hidden: {
      visibility: "hidden",
    },
    toggle: {
      width: "64px",
      justifyContent: "center",
      paddingLeft: "0px",
    },
  })
);
