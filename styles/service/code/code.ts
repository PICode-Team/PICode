import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

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
            height: "100%",
            color: theme.font.high.color,
        },
        row: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
        },
        column: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
            display: "flex",
            flexDirection: "column",
        },
        emptyCode: {
            width: "100%",
            height: "100%",
            color: theme.font.high.color,
            fontSize: theme.font.high.size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.backgroundColor.step0,
        },
        drag: {
            backgroundColor: theme.editor.drag.emptyCode,
        },
        wrapperDrag: {
            "& *": {
                pointerEvents: "none",
            },
        },
    })
);

export const fileStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        file: {},
    })
);

export const directoryStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        directory: {},
    })
);

export const sidebarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        sidebar: {
            width: "300px",
            height: "100%",
            position: "relative",
            backgroundColor: theme.backgroundColor.step3,
        },
        rootDirectory: {
            fontSize: "14px",
            fontWeight: "bold",
            color: theme.font.low.color,
            textTransform: "uppercase",
            cursor: "pointer",
            "& svg": {
                width: "13px",
                height: "13px",
                marginRight: "3px",
                transform: "rotate(0.25turn)",
            },
        },
        fileWrapper: {
            overflowY: "hidden",
            display: "flex",
            height: "calc(100% - 21px)",
            flexDirection: "column",
            "&:hover": {
                overflowY: "auto",
            },
        },
        rootClose: {
            height: "0px !important",
        },
        rootRotate: {
            "&>svg": {
                transform: "rotate(1turn)",
            },
        },
        depth: {
            width: "100%",
            height: "fit-content",
            display: "block",
            overflowY: "hidden",
            "&>div>svg": {
                transform: "rotate(0.25turn)",
            },
        },
        close: {
            height: "20px !important",
            "&>div>svg": {
                transform: "rotate(1turn)",
            },
        },
        file: {
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: theme.font.high.color,
            opacity: 1,
            "&>svg": {
                width: "12px",
                height: "12px",
                marginRight: "3px",
            },
            "&>span": {
                width: "12px",
                height: "12px",
                marginRight: "4px",
                backgroundImage: `url('/images/language/typescript.svg')`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 1,
            },
            "&>input": {
                outline: "none",
                border: "none",
                backgroundColor: theme.backgroundColor.step2,
                color: theme.font.high.color,
            },
            "&:hover": {
                backgroundColor: theme.hover,
            },
        },
        cpp: {},
        c: {},
        typescript: {},
        javascript: {},
        go: {},
        python: {},
        cs: {},
        group: {},

        added: {},
        modified: {},
        untracked: {},
        deleted: {},
        crashed: {},
        renamed: {},
        submodules: {},
        error: {},
        open: {},

        fileFunctionMenu: {
            position: "absolute",
            left: 0,
            top: 0,
            width: "250px",
            backgroundColor: theme.backgroundColor.step1,
            padding: "4px 0px",
            zIndex: 999,
        },
        fileMenu: {
            fontSize: "11px",
            height: "27px",
            lineHeight: "27px",
            display: "flex",
            justifyContent: "space-between",
            color: theme.font.high.color,
            padding: "0px 20px",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: theme.backgroundColor.step0,
            },
        },
        divider: {
            margin: "4px 0px",
            borderTop: "1px solid",
            borderTopColor: theme.divider,
        },

        drag: {
            backgroundColor: theme.backgroundColor.step2,
        },
        dragWrapper: {},

        emptySpace: {
            flex: 1,
            backgroundColor: theme.backgroundColor.step3,
        },
    })
);

export const terminalStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        terminal: {
            width: "100%",
            position: "relative",
            padding: "12px",
            "&:focus": {
                outline: "none",
            },
            overflow: "hidden",
        },
        resizerBar: {
            height: "10px",
            width: "100%",
            position: "absolute",
            marginTop: "-12px",
            marginLeft: "-12px",
            "&:hover": {
                background: theme.backgroundColor.step2,
                cursor: "row-resize",
            },
        },
    })
);

export const tabStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        tab: {
            flex: "0 0 auto",
            minWidth: "112px",
            width: "fit-content",
            height: "100%",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            padding: "2px 12px",
            cursor: "pointer",
            fontSize: "0px",
            backgroundColor: theme.editor.tab,
            "&:hover": {
                "&>div>svg": {
                    display: "inline-block",
                },
            },
        },
        active: {
            backgroundColor: theme.editor.active,
            color: theme.font.high.color,
            "&>div": {
                opacity: 0.9,
            },
            "&>div>svg": {
                display: "block",
                opacity: 0.9,
            },
        },
        icon: {
            width: "16px",
            height: "16px",
            marginRight: "4px",
            backgroundImage: `url('/images/language/typescript.svg')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        },
        text: {
            color: theme.font.low.color,
            opacity: 0.5,
            marginRight: "8px",
            fontSize: "14px",
        },
        closeButton: {
            display: "flex",
            alignItems: "center",
            zIndex: 999,
            position: "relative",
            "&>svg": {
                display: "none",
                color: theme.font.high.color,
                opacity: 0.5,
                width: "15px",
                height: "15px",
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "7.5px",
                },
            },
        },
        isChanged: {},
        drag: {
            backgroundColor: theme.editor.drag.tab,
            "&>div": {
                pointerEvents: "none",
            },
        },
    })
);

export const tabbarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        tabbar: {
            width: "100%",
            height: "35px",
        },
        section: {
            width: "100%",
            height: "100%",
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
        },
        drag: {
            backgroundColor: theme.editor.drag.tabbar,
        },
        emptySpace: {
            flex: 1,
            backgroundColor: theme.editor.tabbar,
        },
    })
);

export const pathStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        pathWrapper: {
            width: "100%",
            height: "20px",
            backgroundColor: theme.editor.path,
            boxShadow: "rgba(0, 0, 0, 0.6) 0px 5px 5px -5px",
            position: "fixed",
            paddingLeft: "15px",
        },
        path: {
            color: theme.font.low.color,
            opacity: 0.5,
            "&:hover": {
                opacity: 0.8,
            },
        },
        icon: {},
        divider: {},
    })
);

export const editorStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        editor: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
            "& *": {
                transition: "none !important",
            },
        },
        topbar: {
            width: "100%",
            height: "55px",
        },
        editorWrapper: {
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
        },
        drag: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
            opacity: 0.2,
            display: "flex",
        },
        center: {
            backgroundColor: theme.editor.drag.code,
            width: "100%",
            height: "100%",
        },
        left: {
            backgroundColor: theme.editor.drag.code,
            width: "50%",
            height: "100%",
        },
        right: {
            backgroundColor: theme.editor.drag.code,
            width: "50%",
            height: "100%",
        },
        top: {
            backgroundColor: theme.editor.drag.code,
            width: "100%",
            height: "50%",
        },
        bottom: {
            backgroundColor: theme.editor.drag.code,
            width: "100%",
            height: "50%",
        },
        leftWrapper: {
            justifyContent: "flex-start",
        },
        rightWrapper: {
            justifyContent: "flex-end",
        },
        topWrapper: {
            alignItems: "flex-start",
        },
        bottomWrapper: {
            alignItems: "flex-end",
        },
        wrapperDrag: {
            "& *": {
                pointerEvents: "none",
            },
        },
    })
);

export const editorLayoutStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        row: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
        },
        column: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.backgroundColor.step3,
            display: "flex",
            flexDirection: "column",
        },
    })
);
