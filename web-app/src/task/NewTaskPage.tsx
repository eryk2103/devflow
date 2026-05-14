import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import TaskForm, { type TaskFormData } from "./TaskForm";
import useApiFetch from "../core/useApiFetch";

export default function NewTaskPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { fetchApi } = useApiFetch();

    const handleSubmit = async (formData: TaskFormData) => {
        setLoading(true);
        try {
            const res = await fetchApi(`tasks`, {
                method: "POST",
                body: JSON.stringify({ ...formData, project_id: projectId })
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

            navigate(`/project/${projectId}`);
        }
        catch {
            setError("Something went wrong. Try again later.")
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Stack sx={{ alignItems: { md: "center" } }}>
            <Stack spacing={3} sx={{ minWidth: { md: 700 } }}>
                <Loading isLoading={loading} />
                <TaskForm onSubmit={handleSubmit} title="New task" onCancelNavigate={`/project/${projectId}`} error={error} />
            </Stack>
        </Stack>
    );
}