import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const issueStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        header: {
            padding: "0 30px",
            height: "50px",
            width: "100%",
            lineHeight: "20px",
            display: "inline-block",
            position: "relative",
            fontWeight: 500,
            color: theme.font.small.color,
            fontSize: theme.font.small.size,
            "&>input": {
                width: "50%",
            },
        },
        contentWrapper: {
            width: "100%",
            height: "calc(100% - 161px)",
            padding: "24px",
            paddingTop: 0,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
        },
        title: {
            fontSize: theme.font.high.size,
            color: theme.font.high.color,
            padding: "24px",
        },
        createButton: {
            background: theme.backgroundColor.step1,
        },
        content: {
            width: "calc(100% - 80px)",
            height: "calc(100% - 161px)",
            margin: "0px 30px",
            background: theme.backgroundColor.step1,
            color: theme.font.high.color,
        },
        wrapper: {
            width: "100%",
            height: "100%",
        },
        mileItem: {
            width: "100%",
            height: "50px",
            borderBottom: `1px solid ${theme.font.high.color}`,
        },
        mileItemContent: {
            width: "100%",
            height: "100%",
            color: theme.font.low.color,
            borderBottom: `1px solid ${theme.backgroundColor.step3}`,
            "&:hover": {
                background: theme.backgroundColor.step3,
                cursor: "pointer",
            },
            "&>div": {
                height: "50px",
                lineHeight: "50px",
                textAlign: "center",
            },
        },
        columnWraper: {
            width: "calc(25% - 40px)",
            height: "calc(100% - 40px)",
            margin: "20px",
            background: theme.backgroundColor.step2,
            borderRadius: "4px",
            padding: "10px",
        },
        columnItem: {
            width: "100%",
            height: "70px",
            margin: "10px 0",
            background: theme.backgroundColor.step3,
        },
    })
);
