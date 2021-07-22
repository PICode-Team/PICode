import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const codeStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: "#1E1E1E",
      width: "calc(100% - 64px)",
      height: "100%",
      display: "flex",
    },
    content: { width: "calc(100% - 300px)", height: "100%" },
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
      backgroundColor: theme.backgroundColor.step3,
    },
    rootDirectory: {
      fontSize: "16px",
      fontWeight: "bold",
      "& svg": {
        width: "13px",
        height: "13px",
        marginRight: "3px",
      },
    },
    fileWrapper: {},
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
      color: "#ffffff",
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
      "&:hover": {
        opacity: 1,
      },
    },
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
  })
);

export const terminalStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    terminal: {},
  })
);

export const tabStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    tab: {
      flex: "0 0 auto",
      width: "112px",
      height: "100%",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      padding: "2px 12px",
      cursor: "pointer",
      fontSize: "0px",
      backgroundColor: "#404040",
      "&:hover": {
        "&>div>svg": {
          display: "inline-block",
        },
      },
    },
    active: {
      backgroundColor: "#1E1E1E",
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
      color: "#ffffff",
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
        color: "#ffffff",
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
      backgroundColor: "rgba(30,30,30, 0.65) !important",
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
      backgroundColor: "rgba(58,65,69, 0.65) !important",
    },
    emptySpace: {
      flex: 1,
      backgroundColor: "#3a4145",
    },
  })
);

export const pathStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    pathWrapper: {
      width: "100%",
      height: "20px",
      backgroundColor: "#1E1E1E",
      boxShadow: "rgba(0, 0, 0, 0.6) 0px 5px 5px -5px",
      position: "fixed",
      paddingLeft: "15px",
    },
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
      backgroundColor: "#ffffff",
      width: "100%",
      height: "100%",
    },
    left: {
      backgroundColor: "#ffffff",
      width: "50%",
      height: "100%",
    },
    right: {
      backgroundColor: "#ffffff",
      width: "50%",
      height: "100%",
    },
    top: {
      backgroundColor: "#ffffff",
      width: "100%",
      height: "50%",
    },
    bottom: {
      backgroundColor: "#ffffff",
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
