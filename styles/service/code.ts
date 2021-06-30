import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";

export const codeStyle = makeStyles((theme: any) =>
  createStyles({
    root: {
      backgroundColor: theme.backgroundColor.step0,
      width: "calc(100% - 200px)",
      height: "100%",
      display: "flex",
    },
    content: {
      width: "calc(100% - 300px)",
    },
  })
);

export const sidebarStyle = makeStyles((theme: any) =>
  createStyles({
    root: {
      width: "300px",
      height: "100%",
      backgroundColor: theme.backgroundColor.step3,
    },
  })
);
