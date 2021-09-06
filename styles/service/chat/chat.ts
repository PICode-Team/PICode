import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const chatStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: "#2c3239",
      width: "100%",
      height: "100%",
      display: "flex",
    },

    sidebar: {
      width: "400px",
      height: "100%",
      backgroundColor: "#3b434d",
      resize: "horizontal",
      overflow: "auto",
      padding: "20px",
    },

    sidebarHeader: {
      padding: "0px 12px",
      marginBottom: "30px",
    },

    search: {
      width: "100%",
      height: "40px",
      backgroundColor: "#434D59",
      borderRadius: "20px",
      display: "flex",
      padding: "0px 12px",
      alignItems: "center",
      "&>svg": {
        color: "#ffffff",
        marginRight: "6px",
      },
      "&>input": {
        backgroundColor: "inherit",
        outline: "none",
        border: "none",
        color: "#ffffff",
        marginTop: "4px",
        "&::placeholder": {
          color: "rgba(183, 183, 183, 0.42)",
          fontSize: "17px",
        },
      },
    },

    sidebarContent: {},

    channel: {
      margin: "0px -15px",
      width: "calc(100% + 30px)",
      height: "60px",
      display: "flex",
      color: "#ffffff",
      padding: "10px 26px",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#505866",
      },
    },
    channelThumbnail: {
      width: "40px",
      height: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      marginRight: "12px",
    },
    channelBody: {
      flex: 1,
    },
    channelInfo: {},
    channelName: {
      marginRight: "8px",
      fontWeight: "bold",
    },
    channelParticipant: {},
    lastContent: {},
    channelTail: {
      width: "70px",
    },
    unreadMessage: {},
    lastTime: {
      marginTop: "20px",
      fontSize: "12px",
    },

    contentWrapper: {
      height: "100%",
      flex: 1,
      backgroundColor: "#2C3239",
    },

    contentHeader: {
      height: "60px",
      width: "100%",
      borderBottom: "1px solid #505050",
      display: "flex",
      alignItems: "center",
      padding: "0px 20px",
    },

    targetThubnail: {
      width: "40px",
      height: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      marginRight: "12px",
    },
    targetInfo: {
      color: "#ffffff",
    },
    targetName: {
      fontWeight: "bold",
    },
    targetLast: {
      fontSize: "12px",
    },
    targetParticipant: {},

    content: {
      height: "calc(100% - 165px)",
      width: "100%",
      flex: 1,
      display: "flex",
      overflow: "auto",
    },
    contentBox: {
      height: "fit-content",
      minHeight: "calc(100% - 20px)",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      marginBottom: "10px",
      marginTop: "10px",
    },

    messageBox: {
      padding: "8px 20px",
      display: "flex",
    },
    messageInfo: {
      "&:hover": {
        "&>div>span>span": {
          display: "none",
        },
        "&>div>span>div": {
          display: "flex",
        },
      },
    },
    thumbnail: {
      backgroundColor: "#E8912D",
      width: "22px",
      height: "22px",
      borderRadius: "11px",
    },
    target: {
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
      borderRadius: "14px",
      padding: "4px 14px",
      color: theme.font.high.color,
      maxWidth: "750px",
    },
    time: {
      color: theme.font.high.color,
      fontSize: "10px",
      margin: "0px 5px",
    },
    interactionDivider: {
      width: "1px",
      height: "16px",
      margin: "2px 0px",
      backgroundColor: "#8092a8",
    },
    interactionIcon: {
      padding: "4px",
      height: "18px",
      cursor: "pointer",
      "&>svg": {
        width: "14px",
        height: "14px",
        color: "#afc3db",
      },
      "&:hover": {
        "&>svg": {
          color: "#ffffff",
        },
      },
    },
    messageInteraction: {
      display: "none",
      backgroundColor: "#667485",
      borderRadius: "4px",
    },

    activitybar: {
      width: "400px",
      height: "100%",
      borderLeft: "1px solid #505050",
    },

    activitybarHeader: {
      height: "60px",
      width: "100%",
      borderBottom: "1px solid #505050",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      padding: "0px 20px",
      justifyContent: "space-between",
    },

    activitybarTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      marginRight: "8px",
    },
    activitybarTarget: {},
    activitybarClose: {
      marginTop: "8px",
      cursor: "pointer",
    },

    activitybarContent: {
      maxHeight: "calc(100% - 60px)",
      overflow: "auto",
      paddingBottom: "50px",
    },

    newMessage: {
      color: theme.font.high.color,
      width: "calc(100% - 292px)",
      height: "30px",
      position: "absolute",
      top: "0px",
      display: "flex",
      alignItems: "center",
      pointerEvents: "none",
      justifyContent: "center",
      "&>div": {
        backgroundColor: theme.backgroundColor.step1,
        width: "130px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        cursor: "pointer",
        opacity: 0,
        pointerEvents: "none",
        transition: "ease-in 0.4s opacity",
        "&:after": {
          content: "''",
          position: "absolute",
          top: "100%",
          left: "50%",
          marginLeft: "-6px",
          marginBottom: "-6px",
          border: "6px solid transparent",
          borderTopColor: theme.backgroundColor.step1,
        },
      },
    },
    active: {
      backgroundColor: "#505866 !important",
    },

    createChannel: {
      margin: "0px -15px",
      width: "calc(100% + 30px)",
      height: "60px",
      display: "flex",
      color: "#ffffff",
      padding: "10px 26px",
      borderRadius: "10px",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&>svg": {
        color: "#ffffff",
        width: "40px",
        height: "40px",
      },
      "&:hover": {
        backgroundColor: "#505866",
      },
    },

    input: {
      height: "105px",
      padding: "0px 20px",
      paddigTop: "10px",
    },
    inputBox: {
      height: "calc(100% - 24px)",
      width: "100%",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      color: theme.font.medium.color,
      backgroundColor: theme.backgroundColor.step1,
      "&>input": {
        minHeight: "38px",
        width: "100%",
        backgroundColor: "inherit",
        color: "inherit",
        outline: "none",
        border: "none",
        padding: "8px",
        fontSize: "16px",
      },
    },
    interaction: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "51px",
      padding: "4px 8px 0px",
      "&>div": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      "&>div>div>svg": {
        color: "#515C60",
        cursor: "pointer",
        "&:hover": {
          color: "#ffffff",
        },
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
      alignItems: "center",
    },
    dayBoundary: {
      width: "100%",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative",
      top: "11px",
    },
    timeTicket: {
      position: "relative",
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

    visible: {
      pointerEvents: "auto !important" as any,
      "&>div": {
        opacity: "1 !important",
        pointerEvents: "auto !important" as any,
      },
    },

    thread: {
      height: "24px",
      display: "flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: "10px",
      backgroundColor: "#5a687a",
      marginTop: "6px",
      marginLeft: "6px",
      cursor: "pointer",
    },
    threadParticipant: {
      display: "flex",
      marginRight: "6px",
      "&>div": {
        width: "18px",
        height: "18px",
        borderRadius: "9px",
        backgroundColor: "#ffffff",
        marginRight: "4px",
      },
    },
    threadCount: {
      marginRight: "6px",
      color: "#ffffff",
      fontSize: "12px",
    },
    lastThread: {
      color: "#ffffff",
      fontSize: "12px",
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
      backgroundColor: "#2c3239",
      zIndex: 9999,
      top: 0,
      left: 0,
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
      marginBottom: "12px",
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
        border: "none",
        outline: "none",
        backgroundColor: "#4078b8",
        color: "#ffffff",
        fontSize: "15px",
        width: "76px",
        height: "32px",
        borderRadius: "4px",
        cursor: "pointer",
        "&:hover": {
          background: "#488cd9",
          transition: "all 0.3s",
        },
      },
    },
    visibility: {
      visibility: "hidden",
    },
    input: {
      background: "#3b434c",
      color: "#ffffff",
      width: "100%",
      outline: "none",
      border: "none",
      height: "40px",
      marginBottom: "12px",
      padding: "8px",
      fontSize: "15px",
    },
    participantWrapper: {},
    participant: {
      display: "inline-block",
      "&>input": {
        marginRight: "4px",
        border: "none",

        "&:checked": {},

        "&:disabled": {},
      },
      "&>label": {
        color: theme.font.high.color,
      },
    },
  })
);
