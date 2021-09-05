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
  const [label, setLabel] = React.useState<string>("");
  const [mileList, setMileList] = React.useState<any[]>([]);
  const [userList, setUserList] = React.useState<any[]>([]);
  const router = useRouter();

  const getUserList = async () => {};

  const getMileList = async () => {};

  React.useEffect(() => {
    setColumn(props.column);

    if (props.edit === true) {
      setTitle(props.modalData.title);
      setContent(props.modalData.content);
      setAssigner(props.modalData.assigner);
      setColumn(props.modalData.column);
      setMilestone(props.modalData.milestone);
      setLabel(props.modalData.label);
    }

    getUserList();
    getMileList();
  }, []);

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
          Make Issue
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
            Development for this Project
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
          <div style={{ marginBottom: "13px", display: "flex" }}>
            <div style={{ width: "80px" }}>content</div>
            <textarea
              placeholder={content}
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
          <div style={{ marginBottom: "10px", display: "flex" }}>
            <div style={{ width: "80px" }}>label</div>
            <input
              placeholder={label}
              style={{
                background: "#3b434c",
                padding: "4px 8px",
                border: "none",
                outline: "none",
                color: "#ffffff",
                width: "300px",
              }}
              onChange={(e) => setLabel(e.target.value)}
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
              onClick={() => {
                setTitle("");
                setContent("");
                setAssigner("");
                setColumn("");
                setMilestone("");
                setLabel("");
                props.setOpen(false);
              }}
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
                    creator: props.userId,
                    assigner: assigner,
                    column: column,
                    content: content,
                    milestone: milestone,
                    label: label,
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
