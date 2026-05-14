import { CircularProgress, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Task } from "./models";
import { Link, useParams } from "react-router";
import { useAuth } from "../auth/AuthContext";
import Message from "../shared/Message";

export default function TaskList({ status }: { status: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { id } = useParams();
    const { token } = useAuth();
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks?project=${id}&status=${status}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(true)
                }
                setTasks(data);
            }
            catch (err) {
                setError(true);
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, [status]);

    if (loading) {
        return (
            <Stack sx={{ alignItems: "center" }}>
                <CircularProgress color="inherit" sx={{ mt: 5 }} />
            </Stack>
        );
    }

    if (error) {
        return <Message value="Something went wrong. Try again later." />;
    }

    if (tasks.length === 0) {
        return <Message value="No projects found." />;
    }

    return (
        <List>
            {tasks.map(task =>
                <Fragment key={task.id}>
                    <ListItemButton component={Link} to={`task/${task.id}`}>
                        <ListItemText primary={task.name} />
                        <ListItemIcon sx={{ justifyContent: 'end' }}>
                            <ChevronRightIcon />
                        </ListItemIcon>
                    </ListItemButton>
                    <Divider />
                </Fragment>
            )}
        </List>
    );
}