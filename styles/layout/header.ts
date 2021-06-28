import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { darkThemeColor, whiteThemeColor } from "../color";

export const headerStyle = (ctx: any) => {
  return makeStyles(() =>
    createStyles({
      root: {
        backgroundColor:
          ctx === "dark"
            ? darkThemeColor.backgroundColor.step2
            : whiteThemeColor.backgroundColor.step2,
        width: "100%",
        height: "43px",
        display: "flex",
        alignItems: "center",
      },
    })
  );
};
