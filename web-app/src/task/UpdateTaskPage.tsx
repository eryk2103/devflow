import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import TaskForm, { type TaskFormData } from "./TaskForm";
import type { Task } from "./models";
import useApiFetch from "../core/useApiFetch";

export default function UpdateTaskPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { projectId, taskId } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const { fetchApi } = useApiFetch();

    useEffect(() => {
        setLoading(true);
        const load = async () => {
            try {
                const res = await fetchApi(`tasks/${taskId}`, {
                    method: "GET"
                });

                const data = await res.json();

                if (!res.ok) {
                    setError("Something went wrong. Try again later");
                }

                setTask(data);
            } catch {
                setError("Something went wrong. Try again later.");
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSubmit = async (formData: TaskFormData) => {
        setLoading(true);
        try {
            const res = await fetchApi(`tasks/${taskId}`, {
                method: "PUT",
                body: JSON.stringify({ ...formData })
            });

            if (!res.ok) {
                if (res.status === 409) {
                    setError("Task with this name already exists.")
                }
                else {
                    setError("Something went wrong. Try again later.");
                }
                return;
            }

            navigate(`/project/${projectId}/task/${taskId}`);
        }
        catch {
            setError("Something went wrong. Try again later.")
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading isLoading={loading} />;
    }

    return (
        <Stack sx={{ alignItems: { md: "center" } }}>
            <Stack spacing={3} sx={{ minWidth: { md: 700 } }}>
                <TaskForm onSubmit={handleSubmit} title="Update task" onCancelNavigate={`/project/${projectId}/task/${taskId}`} error={error} task={task} />
            </Stack>
        </Stack>
    );
}