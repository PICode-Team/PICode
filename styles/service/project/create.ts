import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const userModalStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    overlay: {
      width: "100%",
      height: "100%",
      position: "absolute",
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
      top: 0,
      left: 0,
      backgroundColor: "#2c3239",
      zIndex: 9999,
      marginLeft: "35%",
      marginTop: "10%",
      borderRadius: "4px",
    },
    modalHeader: {
      fontWeight: "bold",
      color: theme.font.medium.color,
      marginBottom: "12px",
      padding: "8px 14px",
      backgroundColor: "#434c57",
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
    addedWrapper: {
      display: "flex",
      padding: "0px 4px",
      marginBottom: "6px",
    },
    addedItem: {
      height: "16px",
      padding: "2px 4px",
      backgroundColor: "#434c57",
      borderRadius: "4px",
      marginRight: "8px",
      color: "#ffffff",
      fontSize: "10px",
      display: "flex",
      alignItems: "center",
      "&>div": {
        display: "flex",
        alignItems: "center",
      },
      "&>div>svg": {
        marginLeft: "4px",
        width: "10px",
        height: "10px",
        cursor: "pointer",
      },
    },
    inputWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    input: {
      "&>input": {
        backgroundColor: "inherit",
        border: "none",
        outline: "none",
        color: "#ffffff",
      },
    },
    addButton: {
      "&>button": {
        border: "none",
        outline: "none",
        backgroundColor: "#4078b8",
        color: "#ffffff",
        fontSize: "12px",
        width: "50px",
        height: "20px",
        borderRadius: "4px",
        cursor: "pointer",
        "&:hover": {
          background: "#488cd9",
          transition: "all 0.3s",
        },
      },
    },

    subTitle: {
      padding: "4px 12px",
      color: "#ffffff",
    },
    user: {
      display: "flex",
      justifyContent: "space-between",
      padding: "4px 12px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#3b4a4f",
      },
    },
    userList: {},
    userInfo: {
      display: "flex",
    },
    thumbnail: {
      width: "18px",
      height: "18px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      marginRight: "6px",
    },
    userName: {
      color: "#ffffff",
    },
    privileges: {},
  })
);

export const createProjectStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      padding: "32px",
    },
    header: {
      width: "100%",
      fontSize: theme.font.high.size,
      color: theme.font.high.color,
      marginBottom: "30px",
    },
    content: {
      width: "100%",
      height: "fit-content",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "5px",
    },
    optionalContent: {
      width: "100%",
      height: "fit-content",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      width: "100%",
      paddingTop: "24px",
      fontSize: theme.font.medium.size,
      color: theme.font.medium.color,
    },
    selectContent: {
      width: "100%",
      paddingTop: "16px",
      height: "100%",
    },
    typeContent: {
      width: "100%",
      height: "fit-content",
      display: "flex",
      gap: "30px",
    },
    typeNode: {
      cursor: "pointer",
      width: "250px",
      display: "flex",
      minWidth: "242px",
      alignItems: "center",
      flexDirection: "column",
      padding: "70px 30px",
      color: theme.font.medium.color,
      background: "#3b434c",
      "&:hover": {
        background: "#4d5763",
        transition: "all 0.3s",
        color: theme.font.low.color,
      },
      "&>svg": {
        width: "100px",
        height: "100px",
      },
      "&>div": {
        fontSize: "24px",
        fontWeight: "bold",
        paddingTop: "15px",
      },
    },
    buttonBox: {
      display: "flex",
      width: "500px",
      justifyContent: "flex-end",
      marginTop: "15px",
    },
    button: {
      width: "100px",
      marginTop: "6px",
      marginLeft: "12px",
      height: "32px",
      color: theme.font.high.color,
      fontSize: theme.font.small.size,
      borderRadius: "2px",
      border: "none",
      background: theme.backgroundColor.step2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&:nth-child(1)": {
        background: "#566372",
        "&:hover": {
          background: "#647487",
          transition: "all 0.3s",
        },
      },
      "&:nth-child(2)": {
        background: "#4078b8",
        "&:hover": {
          background: "#488cd9",
          transition: "all 0.3s",
        },
      },
    },
    inputContent: {
      width: "500px",
    },

    input: {
      display: "flex",
      alignItems: "center",
      marginTop: "16px",
      "&>input": {
        width: "100%",
        background: "#3b434c",
        padding: "4px 8px",
        border: "none",
        borderRadius: "2px",
        color: theme.font.high.color,
        height: "32px",
        lineHeight: "32px",
        flex: 1,
        outline: "none",
      },
      "&>span": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
        marginRight: "8px",
        marginTop: "2px",
        width: "106px",
      },
    },
    textarea: {
      flex: 1,
      "&>textarea": {
        width: "100%",
        background: "#3b434c",
        padding: "6px 12px",
        border: "none",
        borderRadius: "2px",
        color: theme.font.high.color,
        marginTop: "8px",
        lineHeight: "17px",
        fontFamily: "Arial",
        resize: "none",
        outline: "none",
        height: "100px",
      },
      "&>span": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
      },
    },
    participant: {
      display: "flex",
      alignItems: "center",
      marginTop: "16px",
      "&>div": {
        width: "100%",
        backgroundColor: "#3b434c",
        padding: "4px 8px",
        border: "none",
        borderRadius: "2px",
        color: "#757575",
        height: "32px",
        flex: 1,
        outline: "none",
        lineHeight: "24px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        "&:hover": {
          backgroundColor: "#4f5a66",
        },
        "&>div": {
          height: "16px",
          padding: "2px 4px",
          backgroundColor: "#5b6878",
          borderRadius: "4px",
          marginRight: "8px",
          color: "#ffffff",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          "&>div": {
            display: "flex",
            alignItems: "center",
          },
          "&>div>svg": {
            marginLeft: "4px",
            width: "10px",
            height: "10px",
            cursor: "pointer",
          },
        },
      },
      "&>span": {
        color: theme.font.high.color,
        fontSize: theme.font.small.size,
        marginRight: "8px",
        marginTop: "2px",
      },
    },

    divider: {
      width: "100%",
      height: "36px",
      display: "flex",
      alignItems: "center",
      "&>div": {
        width: "100%",
        height: "1px",
        background: "#505050",
      },
    },
    subTitle: {
      color: "#ffffff",
      marginBottom: "10px",
      fontSize: "16px",
    },

    imageUpload: {
      height: "100px",
      width: "100%",
      marginTop: "8px",
      marginBottom: "14px",
      border: `1px solid ${theme.font.small.color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.font.high.color,
    },

    stepper: {
      display: "flex",
      alignItems: "center",
      margin: "30px 0px",
      marginBottom: "65px",
      width: "120vh",
      justifyContent: "center",
    },
    step: {
      width: "24px",
      height: "24px",
      borderRadius: "15px",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      fontWeight: "bold",
      paddingTop: "24px",
    },
    lail: {
      width: "30%",
      height: "1px",
      backgroundColor: "rgba(255, 255, 255, 0.55)",
      margin: "0px 10px",
    },
    active: {
      backgroundColor: "#90CAF9",
    },
    stepNumber: {
      paddingTop: "8px",
      paddingBottom: "10px",
      fontSize: "12px",
      "&>svg": {
        paddingTop: "2px",
        width: "18px",
        height: "18px",
      },
      "&>span": {
        width: "18px",
        height: "18px",
      },
    },
    stepText: {
      whiteSpace: "nowrap",
      fontSize: "14px",
      fontWeight: "normal",
      color: "rgba(255, 255, 255, 0.55)",
    },

    createWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#2c3239",
      padding: "30px",
      height: "calc(100% - 75px)",
    },

    required: {
      color: "#C33030",
    },
  })
);
