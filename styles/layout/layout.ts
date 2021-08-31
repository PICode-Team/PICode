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
            height: "calc(100% - 51px)",
            display: "flex",
            overflowX: "hidden",
        },
        pageName: {
            height: "40px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            color: theme.font.high.color,
            fontSize: "21px",
            "&>svg": {
                width: "30px",
                height: "30px",
                marginLeft: "12px",
                marginRight: "6px",
            },
            borderBottom: `1px solid ${theme.font.small.color}`,
        },
    })
);
