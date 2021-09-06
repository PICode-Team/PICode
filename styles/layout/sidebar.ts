import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const sidebarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        sidebarWrapper: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.backgroundColor.step1,
            position: "sticky",
            top: 0,
        },
        sideBar: {
            width: "200px",
            height: "calc(100% - 64px)",
        },
        toggle: {
            width: "64px",
        },
        toggleButton: {
            width: "64px",
            height: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&>svg": {
                color: theme.font.medium.color,
                width: "34px",
                height: "34px",
            },
        },
    })
);

export const rowStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        row: {
            width: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "20px",
            textDecoration: "none",
            lineHeight: "40px",
            cursor: "pointer",
            fontSize: "16px",
            color: theme.font.medium.color,
            "&>svg": {
                left: 20,
            },
        },
        text: {
            whiteSpace: "nowrap",
            marginLeft: "34px",
        },
        hidden: {
            visibility: "hidden",
        },
        toggle: {
            width: "64px",
            justifyContent: "center",
            paddingLeft: "0px",
        },
        active: {
            background: "#4078B8",
        },
        unactive: {
            "&:hover": {
                background: theme.loginBackground,
            },
        },
        collapseButton: {
            color: theme.font.high.color,
        },
        collapseWrapper: {
            transition: "all ease 0.3s 0s",
            height: "80px",
            width: "100%",
            background: theme.backgroundColor.step2,
            overflow: "hidden",
        },
        unOpenWrapper: {
            transition: "all ease 0.3s 0s",
            height: "0",
            background: theme.backgroundColor.step2,
            width: "100%",
            overflow: "hidden",
        },
    })
);
