import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: "100%",
        },
    }),
);

export default function MakeMile(props: any) {
    const [title, setTitle] = React.useState<string>("");
    const [content, setContent] = React.useState<string>("");
    const [startDate, setStartDate] = React.useState<string>("");
    const [endDate, setEndDate] = React.useState<string>("");
    const [kanban, setKanbane] = React.useState<string>("")
    const router = useRouter();
    const classes = useStyles();

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Make Kanban Board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <input placeholder={"title"} onChange={(e) => setTitle(e.target.value)} />
                    <TextField
                        label="StartDate"
                        type="date"
                        className={classes.textField}
                        onChange={(e) => {
                            setStartDate(e.target.value)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="EndDate"
                        type="date"
                        onChange={(e) => {
                            setEndDate(e.target.value)
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <input placeholder={"content"} onChange={(e) => setContent(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        let payload = {
                            title: title,
                            content: content ?? "",
                            startDate: startDate ?? "",
                            endDate: endDate ?? "",
                        }
                        props.ws.send(JSON.stringify({
                            category: "milestone",
                            type: "createMilestone",
                            data: payload,
                        }))
                        props.setOpen(false)
                    }} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}