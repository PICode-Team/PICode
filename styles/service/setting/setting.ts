import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const settingStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "100%",
      height: "100%",
      display: "flex",
    },
  })
);
