import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const messengerStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        chatButton: {
            backgroundColor: theme.font.high.color,
            width: "60px",
            height: "60px",
            borderRadius: "30px",
            position: "fixed",
            right: "40px",
            zIndex: 99,
            bottom: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&>svg": {
                width: "32px",
                height: "32px",
                color: theme.backgroundColor.step0,
            },
            "&:hover": {
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            },
        },
        messenger: {
            backgroundColor: "#ffffff",
            width: "360px",
            height: "720px",
            position: "fixed",
            right: "30px",
            bottom: "24px",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px",
        },

        wrapper: {
            width: "100%",
            height: "100%",
        },

        header: {
            display: "flex",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 15px",
        },

        back: {
            cursor: "pointer",
            "&>svg": {
                width: "28px",
                height: "28px",
            },
        },
        opponent: {
            width: "90%",
        },
        name: {},
        online: {
            display: "flex",
            fontSize: "11px",
            "&>svg": {
                width: "12px",
                height: "12px",
                color: "green",
            },
        },
        expand: {
            cursor: "pointer",
            "&>svg": {
                width: "15px",
                height: "15px",
                transform: "rotate(0.5turn)",
                marginRight: "4px",
            },
        },
        cancel: {
            cursor: "pointer",
        },

        body: {
            width: "100%",
            height: "calc(100% - 129px)",
            flex: 1,
            display: "flex",
            overflow: "auto",
        },
        contentBox: {
            height: "100%",
            width: "100%",
        },
        content: {
            height: "fit-content",
            minHeight: "calc(100% - 20px)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            margin: "10px 0px",
        },

        timeWrapper: {
            display: "flex",
            flexDirection: "column",
            height: "30px",
            justifyContent: "center",
        },
        dayBoundary: {
            width: "100%",
            borderBottom: "1px solid rgba(0, 0, 0, 0.4)",
            position: "relative",
            top: "11px",
        },
        timeTicket: {
            position: "relative",
            left: "160px",
            color: "rgba(0, 0, 0, 1)",
            width: "fit-content",
            height: "22px",
            lineHeight: "22px",
            fontSize: "12px",
            fontWeight: "bold",
            padding: "0px 12px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
        },

        messageBox: {
            padding: "8px 20px",
            display: "flex",
            paddingBottom: "4px",
            width: "100%",
        },
        user: {
            backgroundColor: "#E8912D",
            width: "22px",
            height: "22px",
            borderRadius: "11px",
        },
        info: {},
        userName: {
            color: "rgba(0, 0, 0, 1)",
            fontWeight: "bold",
            marginLeft: "6px",
        },
        time: {
            color: "black",
            fontSize: "10px",
            margin: "0px 5px",
            width: "fit-content",
            whiteSpace: "nowrap",
        },
        textWrapper: {
            marginLeft: "6px",
            marginTop: "4px",
            display: "flex",
            alignItems: "flex-end",
            maxWidth: "280px",
        },
        messageText: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            borderRadius: "3px",
            padding: "4px 10px",
            color: "#ffffff",
        },

        footer: {
            display: "flex",
            borderTop: "1px solid rgba(0, 0, 0, 0.4)",
            padding: "10px",
            paddingTop: "15px",
            alignItems: "center",
        },
        attachFile: {
            cursor: "pointer",
            marginLeft: "6px",
            "&>svg": {
                transform: "rotate(0.125turn)",
                width: "20px",
                height: "20px",
                color: "rgba(0, 0, 0, 0.4)",
                "&:hover": {
                    color: "rgba(0, 0, 0, 0.7)",
                },
            },
        },
        imoji: {
            cursor: "pointer",
            marginLeft: "6px",
            "&>svg": {
                width: "22px",
                height: "22px",
                color: "rgba(0, 0, 0, 0.4)",
                "&:hover": {
                    color: "rgba(0, 0, 0, 0.7)",
                },
            },
        },
        input: {
            width: "100%",
            border: "none",
            outline: "none",
            padding: "8px 12px",
            paddingTop: "2px",
        },
        send: {
            cursor: "pointer",
            "&>svg": {
                width: "22px",
                height: "22px",
                color: "rgba(0, 0, 0, 0.4)",
                "&:hover": {
                    color: "rgba(0, 0, 0, 0.7)",
                },
            },
        },

        homeHeader: {
            display: "flex",
            alignItems: "center",
            padding: "20px",
        },
        homeBody: {
            width: "100%",
            height: "calc(100% - 129px)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
                backgroundColor: "rgba(230, 230, 230, 0.3) !important",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(230, 230, 230, 0.3) !important",
            },
        },
        homeFooter: {
            display: "flex",
            borderTop: "1px solid rgba(0, 0, 0, 0.4)",
            padding: "10px",
            paddingTop: "15px",
            alignItems: "center",
        },

        backspace: {
            width: "28px",
            height: "28px",
        },
        row: {
            padding: "10px 20px",
            height: "60px",
            width: "100%",
            display: "flex",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
        },
        users: {
            width: "40px",
            height: "40px",
            backgroundColor: "black",
            borderRadius: "8px",
            marginRight: "12px",
        },

        titleWrapper: {
            width: "260px",
        },
        title: {
            display: "flex",
        },
        titleText: {
            fontSize: "11px",
            fontWeight: "bold",
        },
        participant: {
            fontSize: "11px",
            marginLeft: "4px",
        },
        etc: {},
        thumbnail: {
            color: "rgba(0, 0, 0, 0.4)",
            fontSize: "10px",
            fontWeight: "bold",
        },

        chatInfo: {
            textAlign: "right",
        },
        lastTime: {
            fontSize: "10px",
            color: "rgba(0, 0, 0, 0.3)",
            width: "44px",
        },
        count: {
            fontSize: "10px",
            backgroundColor: "red",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "2px 6px",
            borderRadius: "10px",
            width: "fit-content",
            float: "right",
        },
    })
);
