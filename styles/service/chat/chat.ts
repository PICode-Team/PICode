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

    content: {
      width: "calc(100% - 220px)",
      height: "100%",
    },

    title: {
      padding: "8px 12px",
      fontWeight: "bold",
      color: "#ffffff",
      fontSize: "16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      height: "40px",
    },
    toolWrapper: {
      padding: "4px 0px",
    },
    tool: {
      color: "rgba(255, 255, 255, 0.55)",
      padding: "2px 10px",
      display: "flex",
      alignItems: "center",
      height: "26px",
      lineHeight: "26px",
      fontSize: "13px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    on: {
      backgroundColor: "#0576B9",
      color: "#ffffff !important",
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
      color: "rgba(255, 255, 255, 0.55)",
    },
    channel: {
      color: "rgba(255, 255, 255, 0.55)",
      padding: "2px 10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    },
    box: {
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    join: {},
    unjoin: {
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        "&>span": {
          visibility: "visible",
        },
      },
    },
    deleteChannel: {
      visibility: "hidden",
      paddingRight: "8px",
    },
    addChannel: {
      borderRadius: "2px",
      margin: "0px 6px",
      padding: "0px 4px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
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
      color: "rgba(255, 255, 255, 0.55)",
    },
    direct: {
      color: "rgba(255, 255, 255, 0.55)",
      padding: "2px 10px",
      paddingLeft: "16px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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

    contentWrapper: {
      height: "calc(100% - 155px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      marginBottom: "10px",
    },

    input: {
      height: "105px",
      padding: "0px 20px",
      paddigTop: "10px",
      "&>input": {
        height: "calc(100% - 24px)",
        width: "100%",
        backgroundColor: theme.backgroundColor.step1,

        outline: "none",
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
    },
    entering: {
      height: "24px",
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
      color: "#ffffff",
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
      paddingBottom: "4px",
    },
    user: {
      backgroundColor: "#E8912D",
      width: "22px",
      height: "22px",
      borderTopLeftRadius: "2px",
      borderTopRightRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderBottomRightRadius: "2px",
      marginRight: "6px",
    },

    info: {
      display: "flex",
      alignItems: "flex-end",
    },
    name: {
      fontWeight: "bold",
      color: "#ffffff",
      marginRight: "4px",
    },
    time: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "10px",
    },
    textWrapper: {},
    messageText: {
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "bold",
      fontSize: "12px",
    },
    interaction: {},
    emojiWrapper: {},
    emoji: {},
    addEmoji: {},
  })
);
