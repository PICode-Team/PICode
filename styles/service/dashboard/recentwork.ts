import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const recentWorkStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    recentContent: {
      width: "100%",
      height: "60%",
      minHeight: "400px",
      padding: "20px",
    },
    title: {
      fontSize: "24px",
      color: theme.font.high.color,
      paddingBottom: "20px",
    },
    content: {
      width: "100%",
      height: "calc(100% - 54px)",
      background: theme.backgroundColor.step1,
      padding: "24px",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
    },
    view: {
      alignContent: "center",
      width: "100%",
      position: "relative",
      overflow: "hidden",
    },
    selectView: {
      position: "absolute",
      right: "80px",
      zIndex: 2,
      color: "#fff",
    },
    menuDialog: {
      position: "absolute",
      width: "200px",
      right: "175px",
      top: "30px",
      height: "250px",
      background: theme.backgroundColor.step2,
      color: theme.font.high.color,
      zIndex: 3,
      overflow: "hidden",
      overflowY: "scroll",
      borderRadius: "2px",
    },
    menuDialogRow: {
      width: "100%",
      padding: "8px",
      cursor: "pointer",
      "&:hover": {
        background: theme.backgroundColor.step3,
        transition: "all 0.3s",
      },
    },
    leftButton: {
      position: "absolute !important" as any,
      top: "45%",
      zIndex: 2,
      left: "10px",
      color: `${theme.font.high.color}!important `,
    },
    rightButton: {
      position: "absolute !important" as any,
      right: "10px",
      top: "45%",
      zIndex: 2,
      color: `${theme.font.high.color} !important`,
    },
    dropDown: {
      position: "absolute !important" as any,
      right: "175px",
      width: "30px",
      top: "3px",
      height: "30px",
      color: `${theme.font.high.color} !important`,
      zIndex: 3,
    },
    carouselDiv: {
      padding: "0px 20px",
      height: "100%",
    },
    carouselContent: {
      background: theme.backgroundColor.step2,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "12px",
      position: "relative",
    },
    textContent: {
      background: theme.backgroundColor.step3,
      height: "65%",
      width: "100%",
      borderRadius: "0 0 12px 12px",
      paddingTop: "40px",
      color: theme.font.high.color,
    },
    carouselButton: {
      color: `${theme.font.high.color} !important`,
    },
    imageContent: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      width: "120px",
      height: "120px",
      borderRadius: "60px",
      left: "calc(50% - 60px)",
    },
    tableDiv: {
      background: theme.backgroundColor.step3,
      height: "100%",
      borderRadius: "12px",
    },
    tableContent: {
      display: "inline-block",
      color: theme.font.high.color,
    },
    projectName: {
      position: "absolute",
      fontSize: "24px",
      fontWeight: "bold",
      color: theme.font.high.color,
      width: "100%",
      textAlign: "center",
      top: "10%",
    },
    buttonGroup: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    button: {
      width: "45%",
      height: "40px",
      lineHeight: "40px",
      borderRadius: 4, //30
      fontSize: "18px",
      transition: "0.3s",
      cursor: "pointer",
      color: theme.font.high.color,
      background: "#609FF3",
      "&:hover": {
        transition: "0.3s",
        background: "#217BF4",
      },
    },
    item: {
      backgroundColor: "#2c3239",
      cursor: "pointer",
      borderRadius: "6px",
      padding: "20px",
      "&:hover": {
        backgroundColor: "#242c36",
      },
    },
    icon: {
      "&>svg": {
        color: "#b6c1cf",
        "&:hover": {
          color: "#ffffff",
        },
      },
    },
    wrapper: {
      width: "100%",
      height: "100%",
    },
    workspaceContent: {
      width: "100%",
      height: "calc(100% - 50px)",
      background: "#3b434d",
      color: theme.font.high.color,
      display: "grid",
      gridTemplateRows: "repeat(4, 155px)",
      gridTemplateColumns: "repeat(4, calc(25% - 21px))",
      gap: "28px 28px",
      padding: "30px",
    },
  })
);
