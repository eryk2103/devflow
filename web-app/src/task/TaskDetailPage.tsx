import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useEffect, useState } from "react";
import { type Task } from "./models";
import Loading from "../core/Loading";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate, useParams } from "react-router";
import AlertDialog from "../shared/AlertDialog";
import StatusDialog from "./StatusDialog";

const formatDate = (str: string) => {
    const date = new Date(str);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

export default function TaskDetailPage() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();
    const { taskId, projectId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError("Something went wrong. Try again later");
                }

                setTask({ ...data, createdAt: data.created_at });
            }
            catch {
                setError("Something went wrong. Try again later.")
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleTaskDelete = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!res.ok) {
                setError("Something went wrong. Try again later");
            }

            navigate(`/project/${projectId}`);
        } catch {
            setError("Something went wrong. Try again later.");
        }
    }

    if (loading) {
        return <Loading isLoading={loading} />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <Stack spacing={3}>
            {task &&
                <>
                    <PageHeader title={task.name} path={`/project/${projectId}`} />
                    <Stack direction="row" spacing={1}>
                        <AlertDialog title="Delete task" text="Are you sure you want to delete this task?" onConfirmation={handleTaskDelete} />
                        <Button variant="outlined" color="primary" component={Link} to="edit">Edit</Button>
                        <StatusDialog taskId={task.id} currentStatus={task.status} onSuccess={(status) => setTask({ ...task, status })} />
                    </Stack>
                    <Stack>
                        <Typography variant="h5">Details</Typography>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="body1">Status</Typography>
                            <Typography variant="body1">{task.status}</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="body1">Priority</Typography>
                            <Typography variant="body1">{task.priority}</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="body1">Type</Typography>
                            <Typography variant="body1">{task.type}</Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="body1">Created at</Typography>
                            <Typography variant="body1">{formatDate(task.createdAt)}</Typography>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Typography variant="h5">Description</Typography>
                        <Typography variant="body1">{task.description}</Typography>
                    </Stack>
                </>
            }
        </Stack>
    );
}