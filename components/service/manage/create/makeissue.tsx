import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { useRouter } from "next/router";
import { issueStyles } from "../../../../styles/service/manage/makeissue";

export default function MakeIssue(props: any) {
  const classes = issueStyles();
  const [title, setTitle] = React.useState<string>("");
  const [assigner, setAssigner] = React.useState<string>("");
  const [column, setColumn] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [milestone, setMilestone] = React.useState<string>("");
  const router = useRouter();

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="form-dialog-title"
        className={classes.overlay}
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
          Make Kanban Board
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#2c3239",
            color: "#ffffff",
            padding: "20px 30px",
            paddingTop: "10px",
          }}
        >
          <DialogContentText
            style={{ color: "#ffffff", paddingBottom: "20px" }}
          >
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>title</div>
            <input
              placeholder={title}
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
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>assigner</div>
            <input
              placeholder={assigner}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              onChange={(e) => setAssigner(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>state</div>
            <input
              placeholder={column}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              onChange={(e) => setColumn(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>content</div>
            <input
              placeholder={content}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              multiple
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>milestone</div>
            <input
              placeholder={milestone}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              onChange={(e) => setMilestone(e.target.value)}
            />
          </div>
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
                let payload = {
                  kanbanUUID: props.kanban,
                  issueData: {
                    title: title,
                    assigner: "test",
                    column: column,
                    content: content,
                  },
                };
                props.ws.send(
                  JSON.stringify({
                    category: "issue",
                    type: "createIssue",
                    data: payload,
                  })
                );
                props.setOpen(false);
                // window.location.reload()
              }}
            >
              SUBMIT
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
