import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";
import { useRouter } from 'next/router';

export default function MakeIssue(props: any) {
    const [title, setTitle] = React.useState<string>("");
    const [assigner, setAssigner] = React.useState<string>("");
    const [column, setColumn] = React.useState<string>("");
    const [content, setContent] = React.useState<string>("");
    const [milestone, setMilestone] = React.useState<string>("");
    const router = useRouter();

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Make Kanban Board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    title
                    <br />
                    <input placeholder={title} onChange={(e) => setTitle(e.target.value)} />
                    <br />
                    assigner
                    <br />
                    <input placeholder={assigner} onChange={(e) => setAssigner(e.target.value)} />
                    <br />
                    state
                    <br />
                    <input placeholder={column} onChange={(e) => setColumn(e.target.value)} />
                    <br />
                    content
                    <br />
                    <input placeholder={content} multiple onChange={(e) => setContent(e.target.value)} />
                    <br />
                    milestone
                    <br />
                    <input placeholder={milestone} onChange={(e) => setMilestone(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        let payload = {
                            issueData: {
                                title: title,
                                kanban: props.kanban,
                                assigner: "test",
                                column: column,
                                content: content,
                            }
                        }
                        console.log(payload)
                        props.ws.send(JSON.stringify({
                            category: "issue",
                            type: "createIssue",
                            data: payload,
                        }))
                        props.setOpen(false)
                        // window.location.reload()
                    }} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}