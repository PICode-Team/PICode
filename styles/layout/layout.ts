import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { darkThemeColor, whiteThemeColor } from "../color";

export const layoutStyle = (ctx: any) => {
  return makeStyles(() =>
    createStyles({
      contentWrapper: {
        backgroundColor:
          ctx === "dark"
            ? darkThemeColor.backgroundColor.step0
            : whiteThemeColor.backgroundColor.step0,
        width: "100%",
        height: "100%",
        display: "flex",
      },
    })
  );
};
