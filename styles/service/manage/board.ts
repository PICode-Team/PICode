import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const boardStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    header: {
      padding: "10px 40px",
      height: "50px",
      width: "100%",
      lineHeight: "20px",
      paddingLeft: "40px",
      display: "inline-block",
      position: "relative",
      fontWeight: 500,
      color: theme.font.small.color,
      fontSize: theme.font.small.size,
      "&>input": {
        width: "50%",
      },
    },
    createButton: {
      position: "absolute",
      right: "40px",
      height: "30px",
      display: "inline-flex",
      alignItems: "center",
      padding: "5px",
      cursor: "pointer",
      lineHeight: "30px",
      background: theme.backgroundColor.step1,
    },
    wrapper: {
      width: "100%",
      height: "100%",
    },
    content: {
      width: "100%",
      height: "100%",
      background: "#3b434d",
      color: theme.font.high.color,
      display: "grid",
      gridTemplateRows: "repeat(4, 155px)",
      gridTemplateColumns: "repeat(4, calc(25% - 21px))",
      gap: "28px 28px",
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
  })
);
