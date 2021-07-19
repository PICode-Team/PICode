import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const createProjectStyle = makeStyles((theme: IThemeStyle) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },

    stepWrapper: {
      padding: "30px",
    },

    step1: {},
    stepHeader: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "24px",
      marginBottom: "15px",
    },
    optionWrapper: {
      backgroundColor: theme.backgroundColor.step2,
      marginBottom: "6px",
      width: "600px",
      height: "110px",
      display: "flex",
      padding: "15px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#4b595e",
      },
    },
    option: {},
    optionIcon: {
      width: "80px",
      height: "100%",
      marginRight: "15px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    optionHeader: {
      fontSize: "28px",
      color: "rgba(255, 255, 255, 0.85)",
    },
    optionDescription: {
      fontSize: "16px",
      color: "rgba(255, 255, 255, 0.45)",
    },

    step2: {},
    subTitle: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "18px",
      marginBottom: "10px",
    },
    projectInfo: {
      color: "rgba(255, 255, 255, 0.5)",
      marginBottom: "4px",
    },
    input: {
      marginBottom: "12px",
      "&>input": {
        border: "none",
        outline: "none",
        backgroundColor: theme.backgroundColor.step1,
        width: "360px",
        height: "30px",
      },
    },
    privacy: {
      display: "flex",
      marginBottom: "12px",
    },
    radio: {
      marginTop: "2px",
      marginRight: "15px",
    },
    privacyIcon: {
      width: "38px",
      height: "38px",
      marginRight: "15px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    privacyText: {
      width: "420px",
    },
    privacyTitle: {
      color: "rgba(255, 255, 255, 0.85)",
      fontSize: "16px",
    },
    privacyDescription: {
      color: "rgba(255, 255, 255, 0.45)",
      fontSize: "12px",
    },
    optionSection: {
      marginBottom: "30px",
    },
    checkbox: {
      marginTop: "2px",
      marginRight: "12px",
    },
    learnMore: {
      cursor: "pointer",
      color: "#0969DA",
      marginLeft: "4px",
      "&:hover": {
        textDecoration: "underline",
        width: "15px",
      },
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "10px 0px",
      "&>button": {
        marginLeft: "8px",
        width: "56px",
        height: "24px",
        cursor: "pointer",
        backgroundColor: theme.backgroundColor.step4,
        color: "rgba(255, 255, 255, 0.6)",
        border: "none",
        outline: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "rgba(98, 98, 98, 0.8)",
        },
      },
    },
    next: {},
    previous: {},

    step3: {
      width: "504px",
    },
    alpine: {
      backgroundColor: "#ffffff",
      backgroundImage: `url('/images/serverImage/alpine.png')`,
    },
    redhat: {
      backgroundColor: "#ffffff",
      backgroundImage: `url('/images/serverImage/redhat.png')`,
    },
    ubuntu: {
      backgroundColor: "#ffffff",
      backgroundImage: `url('/images/serverImage/ubuntu.png')`,
    },
    centos: {
      backgroundColor: "#ffffff",
      backgroundImage: `url('/images/serverImage/centos.png')`,
    },
  })
);
