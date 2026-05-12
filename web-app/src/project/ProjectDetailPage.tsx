import { Alert, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { type ProjectDetail } from "./models";
import Loading from "../core/Loading";
import PageHeader from "../shared/PageHeader";
import TaskList from "../task/TaskList";
import TaskStatusFilter from "../task/TaskStatusFilter";
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "../auth/AuthContext";
import { Link, useParams } from "react-router";

export default function ProjectDetailPage() {
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();
    const { id } = useParams();

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

    if (loading) {
        return <Loading isLoading={loading} />
    }

    return (
        <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            <PageHeader title={project?.name || ''} path="/" />
            <Typography variant="body1">{project?.description}</Typography>
            <Stack direction="row" spacing={3}>
                <Button variant="outlined" color="error">Delete</Button>
                <Button variant="outlined" color="info">Edit</Button>
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h5">Tasks</Typography>
                    <Button variant="contained" endIcon={<AddIcon />} component={Link} to="task/new">Add task</Button>
                </Stack>
                <TaskStatusFilter />
                <TaskList />
            </Stack>
        </Stack>
    );
}