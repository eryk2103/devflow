import { useNavigate } from "react-router";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import { useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";

export default function NewProjectPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (_data: ProjectFormData) => {
        setLoading(true);
        try {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000)
            });

            navigate("/");
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
            <ProjectForm onSubmit={handleSubmit} title="New project" onCancelNavigate="/" error={error} />
        </Stack>
    );
}