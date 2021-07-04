import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const ButtonStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        main: {
            backgroundColor: theme.button,
            color: theme.font.medium.color,
            width: "100%",
            height: "48px",
            marginBottom: "24px",
            "&:hover": {
                transition: "250ms",
                backgroundColor: theme.button,
                opacity: 0.85,
            },
        },
    })
);
