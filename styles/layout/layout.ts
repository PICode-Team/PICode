import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const LayoutStyle = makeStyles((theme: any) =>
    createStyles({
        main: {
            backgroundColor: theme.backgroundColor.step0,
            width: "100%",
            height: "100%",
        },
    })
);
