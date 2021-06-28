import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const SidebarStyle = makeStyles((theme: any) =>
    createStyles({
        sideBar: {
            backgroundColor: theme.backgroundColor.step1,
            width: "200px",
            height: "calc(100% - 70px)",
            position: "absolute",
            left: "0",
            top: "70px",
        },
    })
);

export const RowStyle = makeStyles((theme: any) =>
    createStyles({
        row: {
            width: "100%",
            height: "50px",
            display: "inline-block",
            paddingLeft: "20px",
            textDecoration: "none",
            lineHeight: "50px",
            cursor: "pointer",
            fontSize: theme.font.low.size,
            color: theme.font.medium.color,
        },
    })
);
