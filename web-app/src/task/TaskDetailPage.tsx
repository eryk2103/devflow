import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useEffect, useState } from "react";
import { type Task } from "./models";
import { TASK_DATA } from "../data";
import Loading from "../core/Loading";

export default function TaskDetailPage() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await new Promise<Task>((resolve) => {
                    setTimeout(() => {
                        resolve(TASK_DATA);
                        //reject(new Error());
                    }, 2000);
                });
                setTask(res);
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

    if (loading) {
        return <Loading isLoading={loading} />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <Stack spacing={3}>
            <PageHeader title={task?.name || ''} path={`/project/${task?.projectId}`} />
            <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="error">Delete</Button>
                <Button variant="outlined" color="primary">Edit</Button>
                <Button variant="outlined" color="secondary">Change status</Button>
            </Stack>
            <Stack>
                <Typography variant="h5">Details</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="body1">Status</Typography>
                    <Typography variant="body1">{task?.status}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="body1">Priority</Typography>
                    <Typography variant="body1">{task?.priority}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="body1">Type</Typography>
                    <Typography variant="body1">{task?.type}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Typography variant="body1">Created at</Typography>
                    <Typography variant="body1">{task?.createdAt}</Typography>
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="h5">Description</Typography>
                <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste minima laboriosam accusantium aliquam voluptatum doloribus mollitia sed sunt ducimus fugit possimus, esse dicta error? Quod, veritatis vero. Nesciunt, nemo quo.</Typography>
            </Stack>
        </Stack>
    );
}