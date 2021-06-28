import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { darkThemeColor, whiteThemeColor } from "../color";

export const sidebarStyle = (ctx: any) => {
  return makeStyles(() =>
    createStyles({
      root: {
        backgroundColor:
          ctx === "dark"
            ? darkThemeColor.backgroundColor.step1
            : whiteThemeColor.backgroundColor.step1,
        width: "216px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px 0px",
      },
    })
  );
};

export const rowStyle = (ctx: any) => {
  return makeStyles(() =>
    createStyles({
      root: {
        width: "100%",
        height: "46px",
        padding: "6px 12px",
      },
      row: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        "&>svg": {
          marginRight: "6px",
          color: "#ffffff",
          width: "24px",
          height: "24px",
        },
      },
      text: {
        color: "#ffffff",
        fontWeight: "bold",
        lineHeight: "16px",
        fontSize: "24px",
      },
    })
  );
};
