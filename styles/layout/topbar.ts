import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const TopbarStyle = makeStyles((theme: any) =>
    createStyles({
        topBar: {
            backgroundColor: theme.backgroundColor.step2,
            width: "100%",
            height: "70px",
            position: "absolute",
            top: "0",
        },
    })
);
