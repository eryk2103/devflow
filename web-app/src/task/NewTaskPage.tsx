import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import { useAuth } from "../auth/AuthContext";
import TaskForm, { type TaskFormData } from "./TaskForm";

export default function NewTaskPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();
    const navigate = useNavigate();
    const { projectId } = useParams();

    const handleSubmit = async (formData: TaskFormData) => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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
        <Stack>
            <Loading isLoading={loading} />
            <TaskForm onSubmit={handleSubmit} title="New task" onCancelNavigate={`/project/${projectId}`} error={error} />
        </Stack>
    );
}