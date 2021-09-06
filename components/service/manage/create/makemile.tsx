import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      width: "380px",
      "& *": {
        color: "#ffffff !important",
        borderColor: "#ffffff",
        fill: "#ffffff",
      },
      "& input::-webkit-calendar-picker-indicator": {
        fill: "#ffffff !important",
        color: "#ffffff !important",
        filter:
          "invert(48%) sepia(30%) saturate(0%) hue-rotate(203deg) brightness(90%) contrast(95%)",
      },
      "& input::-webkit-inner-spin-button": {
        fill: "#ffffff",
        color: "#ffffff !important",
      },
      "& svg": {
        color: "#ffffff",
      },
      "& .MuiInput-underline:before": {
        borderColor: "rgba(255, 255, 255, 0.32) !important",
      },
      "& .MuiInput-underline:after": {
        borderColor: "rgba(255, 255, 255, 0.62)",
      },
      "& .MuiInput-underline:before:hover": {
        borderColor: "rgba(255, 255, 255, 0.62)",
      },
    },
    footerButton: {
      width: "100px",
      marginTop: "6px",
      marginLeft: "12px",
      height: "32px",
      color: "#ffffff",
      fontSize: "12px",
      borderRadius: "2px",
      border: "none",
      background: "#DDDDDD",
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
    select: {
      "&>select": {},
      "&>option": {},
      "&>span": {},
    },
    overlay: {
      "& .MuiDialog-paper": {
        background: "none",
      },
    },
  })
);

export default function MakeMile(props: any) {
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [kanban, setKanbane] = React.useState<string>("");
  const router = useRouter();
  const classes = useStyles();

  React.useEffect(() => {
    if (props.modalData !== undefined) {
      setTitle(props.modalData.title);
      setContent(props.modalData.content);
      setStartDate(props.modalData.startDate);
      setEndDate(props.modalData.endDate);
    }
  }, [props.open]);

  return (
    <div>
      <Dialog
        className={classes.overlay}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          style={{
            backgroundColor: "#2c3239",
            color: "#ffffff",
            padding: "30px 30px 0px 30px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
          id="form-dialog-title"
        >
          {props.edit ? "Edit" : "Make"} Milestone
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#2c3239",
            color: "#ffffff",
            padding: "20px 30px",
            paddingTop: "10px",
            paddingBottom: "30px",
          }}
        >
          <DialogContentText
            style={{ color: "#ffffff", paddingBottom: "20px" }}
          >
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <div style={{ marginBottom: "12px", display: "flex" }}>
            <div style={{ width: "80px" }}>title</div>
            <input
              placeholder={title}
              value={title}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "13px", display: "flex" }}>
            <div style={{ width: "80px" }}>content</div>
            <textarea
              placeholder={content}
              value={content}
              style={{
                width: "300px",
                background: "#3b434c",
                padding: "6px 8px",
                border: "none",
                borderRadius: "2px",
                color: "#ffffff",
                lineHeight: "17px",
                fontFamily: "Arial",
                resize: "none",
                outline: "none",
                height: "100px",
              }}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <TextField
            label="StartDate"
            type="date"
            value={startDate}
            className={classes.textField}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ color: "#ffffff", marginBottom: "16px" }}
          />
          <TextField
            label="EndDate"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ color: "#ffffff" }}
          />
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: "#2c3239",
            color: "#ffffff",
            padding: "0px 30px 30px 30px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <div style={{ display: "flex" }}>
            <button
              className={classes.footerButton}
              onClick={() => props.setOpen(false)}
            >
              CANCEL
            </button>
            <button
              className={classes.footerButton}
              onClick={() => {
                if (props.edit === true) {
                  let payload = {
                    milestoneUUID: props.modalData.uuid,
                    milestoneData: {
                      title: title,
                      content: content ?? "",
                      startDate: startDate ?? "",
                      endDate: endDate ?? "",
                    },
                  };

                  props.ws.send(
                    JSON.stringify({
                      category: "milestone",
                      type: "updateMilestone",
                      data: payload,
                    })
                  );
                } else {
                  let payload = {
                    title: title,
                    content: content ?? "",
                    startDate: startDate ?? "",
                    endDate: endDate ?? "",
                  };

                  props.ws.send(
                    JSON.stringify({
                      category: "milestone",
                      type: "createMilestone",
                      data: payload,
                    })
                  );
                }
                props.setOpen(false);
              }}
            >
              Subscribe
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}