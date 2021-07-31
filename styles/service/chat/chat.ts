import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const chatStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "calc(100% - 64px)",
      height: "100%",
      display: "flex",
    },
    sidebar: {
      width: "220px",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
    },

    contentWrapper: {
      width: "calc(100% - 220px)",
      height: "100%",
    },

    title: {
      padding: "8px 12px",
      fontWeight: "bold",
      color: theme.font.high.color,
      fontSize: "16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      height: "40px",
    },
    toolWrapper: {
      padding: "4px 0px",
    },
    tool: {
      color: theme.font.low.color,
      padding: "2px 10px",
      display: "flex",
      alignItems: "center",
      height: "26px",
      lineHeight: "26px",
      fontSize: "13px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.hover,
      },
      "&>svg": {
        width: "16px",
        height: "16px",
        marginRight: "4px",
      },
    },

    open: {
      height: "28px !important",
      overflowY: "hidden",
      "&>div>svg": {
        transform: "rotate(-0.25turn)",
      },
    },

    channelList: {
      paddingBottom: "12px",
      cursor: "pointer",
      "&>div>svg": {
        transition: "all ease-in 0.1s",
        marginBottom: "4px",
      },
    },
    channelTitle: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      height: "28px",
      lineHeight: "28px",
      color: theme.font.medium.color,
    },
    channel: {
      color: theme.font.medium.color,
      padding: "2px 10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.hover,
      },
    },
    box: {
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    join: {
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        "&>span": {
          visibility: "visible",
        },
      },
    },
    unjoin: {},
    deleteChannel: {
      visibility: "hidden",
      paddingRight: "8px",
    },
    addChannel: {
      borderRadius: "2px",
      margin: "0px 6px",
      padding: "0px 4px",
      backgroundColor: theme.hover,
    },

    directList: {
      cursor: "pointer",
      "&>div>svg": {
        transition: "all ease-in 0.1s",
        marginBottom: "4px",
      },
    },
    directTitle: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      height: "28px",
      lineHeight: "28px",
      color: theme.font.medium.color,
    },
    direct: {
      color: theme.font.medium.color,
      padding: "2px 10px",
      paddingLeft: "16px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        backgroundColor: theme.hover,
        "&>span": {
          visibility: "visible",
        },
      },
    },
    directUserWrapper: {
      display: "flex",
    },
    directUser: {
      backgroundColor: "black",
      width: "16px",
      height: "16px",
      borderTopLeftRadius: "2px",
      borderTopRightRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderBottomRightRadius: "2px",
    },
    directName: {
      marginLeft: "4px",
    },

    header: {
      width: "100%",
      height: "40px",
      backgroundColor: theme.backgroundColor.step0,
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      paddingRight: "16px",
    },
    headerUser: {
      backgroundColor: "#E8912D",
      width: "22px",
      height: "22px",
      borderTopLeftRadius: "2px",
      borderTopRightRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderBottomRightRadius: "2px",
    },
    headerName: {
      color: "rgba(255, 255, 255, 1)",
      fontWeight: "bold",
      marginLeft: "4px",
      marginTop: "4px",
    },
    headerInfo: {
      display: "flex",
      alignItems: "center",
    },
    channelDetail: {},
    participant: {},
    number: {},

    content: {
      height: "fit-content",
      minHeight: "calc(100% - 20px)",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      marginBottom: "10px",
      marginTop: "10px",
    },
    contentBox: {
      height: "calc(100% - 155px)",
      width: "100%",
      flex: 1,
      display: "flex",
      overflow: "auto",
    },

    input: {
      height: "105px",
      padding: "0px 20px",
      paddigTop: "10px",
      "&>input": {
        height: "calc(100% - 24px)",
        width: "100%",
        backgroundColor: theme.backgroundColor.step1,
        color: theme.font.medium.color,
        outline: "none",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
    },
    entering: {
      height: "24px",
      display: "flex",
      alignItems: "center",
    },
    enterIcon: {
      marginRight: "2px",
      "&>svg": {
        width: "10px",
        height: "9px",
        color: theme.font.medium.color,
        transition: "all ease-in 0.2s",
        animation: "$entering 2s infinite",
        "&:nth-child(1)": {},
        "&:nth-child(2)": { animationDelay: "0.25s" },
        "&:nth-child(3)": { animationDelay: "0.5s" },
      },
    },
    enterText: {
      color: theme.font.medium.color,
      fontSize: "11px",
      fontWeight: "bold",
      lineHeight: "24px",
    },

    timeWrapper: {
      display: "flex",
      flexDirection: "column",
      height: "30px",
      justifyContent: "center",
    },
    dayBoundary: {
      width: "100%",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative",
      top: "11px",
    },
    timeTicket: {
      position: "relative",
      left: "50%",
      color: theme.font.high.color,
      width: "fit-content",
      height: "22px",
      lineHeight: "22px",
      fontSize: "12px",
      fontWeight: "bold",
      padding: "0px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      backgroundColor: theme.backgroundColor.step0,
    },

    messageBox: {
      padding: "8px 20px",
      display: "flex",
    },

    interaction: {},
    emojiWrapper: {},
    emoji: {},
    addEmoji: {},

    user: {
      backgroundColor: "#E8912D",
      width: "22px",
      height: "22px",
      borderRadius: "11px",
    },
    name: {
      color: theme.font.high.color,
      fontWeight: "bold",
      marginLeft: "6px",
    },
    textWrapper: {
      marginLeft: "6px",
      marginTop: "4px",
      display: "flex",
      alignItems: "flex-end",
    },
    messageText: {
      backgroundColor: theme.backgroundColor.step3,
      borderRadius: "3px",
      padding: "4px 10px",
      color: theme.font.high.color,
      maxWidth: "750px",
    },
    time: {
      color: theme.font.high.color,
      fontSize: "10px",
      margin: "0px 5px",
    },

    "@keyframes entering": {
      "0%": {
        transform: "translateY(0)",
      },
      "25%": {
        transform: "translateY(-2px)",
      },
      "50%": {
        transform: "translateY(0)",
      },
      "100%": {
        transform: "translateY(0)",
      },
    },
    emptyWrapper: {
      width: "calc(100% - 220px)",
      height: "100%",
      color: theme.font.high.color,
      fontSize: theme.font.high.size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.backgroundColor.step0,
    },
  })
);

export const createChannelStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    overlay: {
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "fixed",
      backgroundColor: "black",
      top: 0,
      left: 0,
      opacity: 0.4,
      zIndex: 9999,
    },
    modal: {
      width: "30%",
      height: "40%",
      position: "absolute",
      display: "fixed",
      backgroundColor: theme.backgroundColor.step1,
      zIndex: 9999,
      marginLeft: "35%",
      marginTop: "10%",
      padding: "30px",
      borderRadius: "12px",
    },
    modalHeader: {
      fontWeight: "bold",
      fontSize: "28px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: theme.font.medium.color,
      "&>div": {
        display: "flex",
        alignItems: "center",
      },
      "&>div>svg": {
        width: "28px",
        height: "28px",
        cursor: "pointer",
      },
    },
    modalBody: {
      height: "70%",
    },
    modalFooter: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      "&>button": {
        marginBottom: "-24px",
      },
    },
    visibility: {
      visibility: "hidden",
    },
  })
);
