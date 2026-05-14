import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { type ProjectDetail } from "./models";
import Loading from "../core/Loading";
import PageHeader from "../shared/PageHeader";
import TaskList from "../task/TaskList";
import TaskStatusFilter from "../task/TaskStatusFilter";
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate, useParams } from "react-router";
import AlertDialog from "../shared/AlertDialog";
import type { TaskStatus } from "../task/models";
import useApiFetch from "../core/useApiFetch";

export default function ProjectDetailPage() {
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const { fetchApi } = useApiFetch();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchApi(`projects/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
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
                const res = await fetchApi(`projects/${id}`, {
                    method: "DELETE"
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
        if (newStatus) {
            setStatus(newStatus);
        }
    };

    if (loading) {
        return <Loading isLoading={loading} />
    }

    return (
        <Stack sx={{ alignItems: { md: "center" } }}>
            <Stack spacing={3} sx={{ minWidth: { md: 700 } }}>
                {error && <Alert severity="error">{error}</Alert>}
                <PageHeader title={project?.name || ''} path="/" />
                <Typography variant="body1">{project?.description}</Typography>
                <Stack direction="row" spacing={3}>
                    <AlertDialog title="Delete project" text="Are you sure you want to delete this project?" onConfirmation={deleteProject} />
                    <Button variant="outlined" color="info" component={Link} to={`/project/${id}/edit`}>Edit</Button>
                </Stack>
                <Divider />
                <Stack spacing={2}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h5">Tasks</Typography>
                        <Button variant="contained" endIcon={<AddIcon />} component={Link} to="task/new">Add task</Button>
                    </Stack>
                    <TaskStatusFilter status={status} onChange={handleStatusChange} />
                    <TaskList status={status} />
                </Stack>
            </Stack>
        </Stack>
    );
}