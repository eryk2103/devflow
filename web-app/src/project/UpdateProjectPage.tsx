import { useNavigate, useParams } from "react-router";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Loading from "../core/Loading";
import { type ProjectDetail } from "./models";
import useApiFetch from "../core/useApiFetch";

export default function UpdateProjectPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const { id } = useParams();
    const { fetchApi } = useApiFetch();

    useEffect(() => {
        setLoading(true);
        const load = async () => {
            try {
                const res = await fetchApi(`projects/${id}`, {
                    method: "GET"
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
            const res = await fetchApi(`projects/${id}`, {
                method: "PUT",
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
        <Stack sx={{ alignItems: { md: "center" } }}>
            <Stack spacing={3} sx={{ minWidth: { md: 700 } }}>
                <Loading isLoading={loading} />
                {!loading && <ProjectForm onSubmit={handleSubmit} title="Update project" onCancelNavigate="/" error={error} project={project} />}
            </Stack>
        </Stack>
    );
}