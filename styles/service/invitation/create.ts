import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const createStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "calc(100% - 64px)",
      height: "100%",
      display: "flex",
    },
    overlay: {
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "fixed",
      backgroundColor: "black",
      top: 0,
      left: 0,
      opacity: 0.4,
      zIndex: 9999,
    },
    modal: {
      width: "30%",
      height: "40%",
      position: "absolute",
      display: "fixed",
      backgroundColor: theme.backgroundColor.step1,
      zIndex: 9999,
      marginLeft: "35%",
      marginTop: "10%",
      padding: "30px",
      borderRadius: "12px",
    },
    modalHeader: {
      fontWeight: "bold",
      fontSize: "28px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#CFCFCF",
      "&>div": {
        display: "flex",
        alignItems: "center",
      },
      "&>div>svg": {
        width: "28px",
        height: "28px",
        cursor: "pointer",
      },
    },
    modalBody: {
      height: "70%",
    },
    modalFooter: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    copyLink: {
      display: "flex",
      alignItems: "center",
      padding: "2px 4px",
      cursor: "pointer",
      marginBottom: "24px",
      position: "relative",
      color: "#CFCFCF",
      "&:hover": {
        backgroundColor: "#283236",
      },
    },
    tooltip: {
      position: "relative",
      display: "inline-block",
    },
    tooltipText: {
      width: "120px",
      backgroundColor: "black",
      color: "#ffffff",
      textAlign: "center",
      borderRadius: "6px",
      padding: "5px 0",

      position: "absolute",
      zIndex: 99999,
      bottom: "150%",
      left: "50%",
      marginLeft: "-60px",
      transition: "ease-in 0.5s opacity",
      opacity: 0,
      pointerEvents: "none",
      "&:after": {
        content: "''",
        position: "absolute",
        top: "100%",
        left: "50%",
        marginLeft: "-10px",
        marginBottom: "-10px",
        border: "10px solid transparent",
        borderTopColor: "black",
      },
    },
    active: { opacity: 1 },
    visibility: {
      visibility: "hidden",
    },
  })
);
