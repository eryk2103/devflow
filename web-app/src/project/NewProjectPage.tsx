import { useNavigate } from "react-router";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import { useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import useApiFetch from "../core/useApiFetch";

export default function NewProjectPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { fetchApi } = useApiFetch();

    const handleSubmit = async (formData: ProjectFormData) => {
        setLoading(true);
        try {
            const res = await fetchApi("projects", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    setError("Project with this name already exists.")
                }
                else {
                    setError("Something went wrong. Try again later.");
                }
                return;
            }

            navigate(`/project/${data.id}`);
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
                <ProjectForm onSubmit={handleSubmit} title="New project" onCancelNavigate="/" error={error} />
            </Stack>
        </Stack>
    );
}