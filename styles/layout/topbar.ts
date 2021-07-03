import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const TopbarStyle = makeStyles((theme: any) =>
    createStyles({
        topBar: {
            backgroundColor: theme.backgroundColor.step2,
            width: "100%",
            height: "70px",
        },
        themeButton: {
            lineHeight: "70px",
            float: "right",
            display: "inline-block",
            marginRight: "20px",
        },
    })
);
