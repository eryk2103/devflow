import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { statuses, type TaskStatus } from './models';
import { Fragment, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function StatusDialog({ taskId, currentStatus, onSuccess }: { taskId: number, currentStatus: TaskStatus, onSuccess: (status: TaskStatus) => void }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<TaskStatus>(currentStatus);
    const { token } = useAuth();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeStatus = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                setError("Something went wrong.")
                return
            }

            const data = await res.json();

            setOpen(false);
            onSuccess(data.status);
        } catch {
            setError("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <Fragment>
            <Button variant="outlined" onClick={handleClickOpen} color='secondary' >
                Change status
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="alert-dialog-title">
                    Change task status
                </DialogTitle>
                <DialogContent>
                    {error && <Alert severity='error'>{error}</Alert>}
                    {loading ? <Stack sx={{ alignItems: "center" }}><CircularProgress color="primary" /></Stack> :
                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="status-select"
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statuses.map((item, index) =>
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                )}
                            </Select>
                        </FormControl>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={changeStatus}>Change</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}