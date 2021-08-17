import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";
import { useRouter } from 'next/router';

export default function MakeKanban(props: any) {
    const [title, setTitle] = React.useState<string>("");
    const [column, setColumn] = React.useState<string>("");
    const [projectName, setProjectName] = React.useState<string>("");
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
                    <input placeholder={title} onChange={(e) => setTitle(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        let payload = {
                            title: title,
                            projectName: router.query.projectName
                        }
                        props.ws.send(JSON.stringify({
                            category: "kanban",
                            type: "createKanban",
                            data: payload,
                        }))
                        props.setOpen(false)
                        window.location.reload()
                    }} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}