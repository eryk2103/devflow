import { useNavigate, useParams } from "react-router";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import { useAuth } from "../auth/AuthContext";
import { type ProjectDetail } from "./models";

export default function UpdateProjectPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
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

    const handleSubmit = async (formData: ProjectFormData) => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                if (res.status === 409) {
                    setError("Project with this name already exists.")
                }
                else {
                    setError("Something went wrong. Try again later.");
                }
                return;
            }

            navigate(`/project/${id}`);
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
            {!loading && <ProjectForm onSubmit={handleSubmit} title="Update project" onCancelNavigate="/" error={error} project={project} />}
        </Stack>
    );
}