import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const UserInfoStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    userInfo: {
      position: "absolute",
      zIndex: 4,
      right: "43px",
      top: "35px",
      backgroundColor: "#505965",
      width: "240px",
      height: "300px",
      borderRadius: "6px",
    },
    topbar: {
      float: "right",
    },
    content: {
      marginTop: "48px",
      height: "240px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    contentText: {
      fontSize: "14px",
      marginTop: "12px",
      width: "100%",
      color: theme.font.high.color,
    },
    logout: {
      width: "100px",
      marginTop: "6px",
      marginLeft: "12px",
      height: "32px",
      color: theme.font.high.color,
      fontSize: "15px",
      borderRadius: "2px",
      border: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#4078b8",
      cursor: "pointer",
      "&:hover": {
        background: "#488cd9",
        transition: "all 0.3s",
      },
    },
  })
);
