import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const alertDialogStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        content: {
            width: "300px",
            height: "400px",
            position: "absolute",
            background: theme.backgroundColor.step4,
            zIndex: 4,
            right: "120px",
            top: "35px",
        },
    })
);
