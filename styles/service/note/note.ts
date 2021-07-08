import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const noteStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            background: theme.backgroundColor.step1,
        },
        fileView: {
            width: "300px",
            height: "100%",
            display: "inline-block",
            background: theme.backgroundColor.step3,
        },
        writeContent: {
            width: "calc(100% - 300px)",
            display: "inline-block",
            height: "100%",
        },
    })
);
