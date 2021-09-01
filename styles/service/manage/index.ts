import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const manageStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        title: {
            fontSize: theme.font.high.size,
            color: theme.font.high.color,
            padding: "24px",
        },
        content: {
            width: "100%",
            height: "calc(100% - 91px)",
            padding: "24px",
            paddingTop: 0,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
        },
        projectContent: {
            width: "100%",
            background: theme.backgroundColor.step2,
            height: "100%",
        },
        projectHeader: {
            width: "100%",
            height: "60px",
            paddingLeft: "40px",
            borderBottom: `3px solid ${theme.backgroundColor.step3}`,
        },
        headerMenu: {
            padding: "10px 20px",
            height: "60px",
            lineHeight: "40px",
            display: "inline-block",
            cursor: "pointer",
            fontWeight: 500,
            color: theme.font.small.color,
            fontSize: theme.font.low.size,
        },
        makeLine: {
            color: theme.font.high.color,
            borderBottom: `3px solid ${theme.backgroundColor.step0}`,
        },
        notSelect: {
            "&:hover": {
                color: theme.font.high.color,
                borderBottom: `3px solid ${theme.backgroundColor.step1}`,
            },
        },
        manageContent: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: "calc(100% - 60px)",
        },
    })
);
