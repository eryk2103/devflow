import { Alert, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { type ProjectDetail } from "./models";
import Loading from "../core/Loading";
import PageHeader from "../shared/PageHeader";
import TaskList from "../task/TaskList";
import TaskStatusFilter from "../task/TaskStatusFilter";
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate, useParams } from "react-router";
import AlertDialog from "../shared/AlertDialog";
import type { TaskStatus } from "../task/models";

export default function ProjectDetailPage() {
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<TaskStatus>("TODO");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
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

                setProject(data);
            } catch {
                setError("Something went wrong. Try again later.");
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const deleteProject = () => {
        const remove = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
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

                navigate("/");
            } catch {
                setError("Something went wrong. Try again later.");
            }
        }

        remove();
    }

    const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newStatus: TaskStatus) => {
        setStatus(newStatus);
    };

    if (loading) {
        return <Loading isLoading={loading} />
    }

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            <PageHeader title={project?.name || ''} path="/" />
            <Typography variant="body1">{project?.description}</Typography>
            <Stack direction="row" spacing={3}>
                <AlertDialog title="Delete project" text="Are you sure you want to delete this project?" onConfirmation={deleteProject} />
                <Button variant="outlined" color="info" component={Link} to={`/project/${id}/edit`}>Edit</Button>
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5">Tasks</Typography>
                    <Button variant="contained" endIcon={<AddIcon />} component={Link} to="task/new">Add task</Button>
                </Stack>
                <TaskStatusFilter status={status} onChange={handleStatusChange} />
                <TaskList status={status} />
            </Stack>
        </Stack>
    );
}