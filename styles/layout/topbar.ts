import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../theme";

export const TopbarStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        topBar: {
            backgroundColor: theme.backgroundColor.step2,
            width: "100%",
            height: "50px",
        },
        logo: {
            height: "50px",
            display: "flex",
            alignItems: "center",
            lineHeight: "50px",
            color: theme.font.high.color,
            fontSize: theme.font.low.size,
            paddingLeft: "20px",
            position: "absolute",
        },
        themeButton: {
            lineHeight: "50px",
            float: "right",
            display: "inline-block",
            color: theme.font.high.color,
        },
        userInfo: {
            lineHeight: "50px",
            display: "inline-block",
            float: "right",
            marginRight: "20px",
            color: theme.font.high.color,
        },
        loginUserInfo: {
            lineHeight: "50px",
            display: "flex",
            float: "right",
            marginRight: "5px",
            paddingTop: "3px",
            color: theme.font.high.color,
            height: "100%",
            alignItems: "center",
        },
        userInfoData: {
            width: "26px",
            height: "26px",
            background: theme.backgroundColor.step3,
            color: theme.font.high.color,
            border: `1px solid ${theme.font.high.color}`,
            borderRadius: "25px",
            marginLeft: "-8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        },
    })
);
