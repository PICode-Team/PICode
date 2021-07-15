import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const codeStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            backgroundColor: theme.backgroundColor.step0,
            width: "calc(100% - 64px)",
            height: "100%",
            display: "flex",
        },
        content: {
            width: "calc(100% - 300px)",
            overflowY: "hidden",
            display: "flex",
        },
        coulmn: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
            display: "flex",
            flexDirection: "column",
        },
    })
);

export const sidebarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "300px",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
        },
    })
);

export const editorStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        editor: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
        },
        topbar: {
            width: "100%",
            height: "55px",
        },
        tabSection: {
            width: "100%",
            height: "35px",
        },
        tab: {},
        pathSection: {
            width: "100%",
            height: "20px",
            backgroundColor: "#1E1E1E",
            boxShadow: "rgba(0, 0, 0, 0.6) 0px 5px 5px -5px",
            position: "fixed",
            paddingLeft: "15px",
        },
        editorWrapper: {
            width: "100%",
            height: "100%",
        },
    })
);

export const pathStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        path: {
            color: "#ffffff",
            opacity: 0.5,
            "&:hover": {
                opacity: 0.8,
            },
        },
        icon: {},
        divider: {},
    })
);

export const tabbarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        wrapper: {
            width: "100%",
            height: "100%",
            backgroundColor: "#3a4145",
        },
        section: {
            width: "100%",
            height: "100%",
            display: "flex",
        },
        tab: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "2px 12px",
            cursor: "pointer",
            fontSize: "0px",
        },
        active: {
            backgroundColor: "#1E1E1E",
            "&>div": {
                opacity: 0.9,
            },
            "&>div>svg": {
                opacity: 0.9,
            },
        },
        icon: {},
        text: {
            color: "#ffffff",
            opacity: 0.5,
            marginRight: "8px",
            fontSize: "14px",
        },
        closeButton: {
            display: "flex",
            alignItems: "center",
            "&>svg": {
                color: "#ffffff",
                opacity: 0.5,
                width: "15px",
                height: "15px",
            },
        },
        isChanged: {},
    })
);
