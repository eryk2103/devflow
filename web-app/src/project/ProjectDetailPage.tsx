import { Alert, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { type ProjectDetail } from "./models";
import { PROJECT_DATA } from "../data";
import Loading from "../core/Loading";
import PageHeader from "../shared/PageHeader";
import TaskList from "../task/TaskList";
import TaskStatusFilter from "../task/TaskStatusFilter";
import AddIcon from '@mui/icons-material/Add';

export default function ProjectDetailPage() {
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await new Promise<ProjectDetail>((resolve) => {
                    setTimeout(() => {
                        resolve(PROJECT_DATA);
                        //reject(new Error());
                    }, 1000);
                });
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
                    <Button variant="contained" endIcon={<AddIcon />}>Add task</Button>
                </Stack>
                <TaskStatusFilter />
                <TaskList />
            </Stack>
        </Stack>
    );
}