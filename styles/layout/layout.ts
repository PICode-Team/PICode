import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const LayoutStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        main: {
            backgroundColor: theme.backgroundColor.step0,
            width: "100%",
            height: "100%",
        },
        contentWrapper: {
            width: "100%",
            height: "calc(100% - 70px)",
            display: "flex",
            overflowX: "hidden",
        },
    })
);
