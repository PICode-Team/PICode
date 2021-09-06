import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const issueStyles = makeStyles((theme: IThemeStyle) =>
  createStyles({
    button: {
      padding: "10px 20px",
      height: "40px",
      width: "200px",
      lineHeight: "20px",
      display: "inline-block",
      textAlign: "center",
      cursor: "pointer",
      margin: "10px",
      fontWeight: 500,
      background: theme.backgroundColor.step1,
      color: theme.font.high.color,
      fontSize: theme.font.small.size,
    },
    buttonDiv: {
      display: "flex",
      float: "right",
    },
    notSelect: {
      "&:hover": {
        color: theme.font.high.color,
        borderBottom: `3px solid ${theme.backgroundColor.step1}`,
      },
    },
    footerButton: {
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
    select: {
      "&>select": {},
      "&>option": {},
      "&>span": {},
    },
    overlay: {
      "& .MuiDialog-paper": {
        background: "none",
      },
    },
  })
);
