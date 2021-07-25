import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const LayoutStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        main: {
            backgroundColor: theme.backgroundColor.step0,
            width: "100%",
            height: "100%",
            "& *::-webkit-scrollbar": {
                height: "10px",
                width: "8px",
                backgroundColor: theme.scroll.bar,
            },
            "& *::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                backgroundColor: theme.scroll.thumb,
            },
            "& *::-webkit-scrollbar-track": {
                borderRadius: "10px",
                backgroundColor: theme.scroll.track,
            },
        },
        contentWrapper: {
            width: "100%",
            height: "calc(100% - 50px)",
            display: "flex",
            overflowX: "hidden",
        },
    })
);
