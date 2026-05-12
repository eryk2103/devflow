import { CircularProgress, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from "react";
import type { Project } from "./models";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import Message from "../shared/Message";

type Props = {
    search?: string;
    onLoadingFinish: () => void;
}

export default function ProjectList({ search, onLoadingFinish }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [initial, setInitial] = useState<Project[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const { token } = useAuth();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(true);
                }

                setProjects(data);
                setInitial(data);
            }
            catch (err) {
                setError(true);
            }
            finally {
                setLoading(false);
                onLoadingFinish();
            }
        }
        load();
    }, [])

    useEffect(() => {
        if (search) {
            const newData = initial.filter((project) => {
                return project.name.toLocaleLowerCase().includes(search.toLowerCase())
            });

            setProjects([...newData]);
        }
        else {
            setProjects([...initial]);
        }
    }, [search]);

    if (error) {
        return <Message value="Something went wrong. Try again later." />;
    }

    if (projects.length === 0) {
        return <Message value="No projects found." />;
    }

    if (loading) {
        return (
            <Stack sx={{ alignItems: "center" }}>
                <CircularProgress color="inherit" sx={{ mt: 5 }} />
            </Stack>
        )

    }

    return (
        <Stack>
            <List>
                {projects.map(project =>
                    <Fragment key={project.id}>
                        <ListItemButton component={Link} to={`/project/${project.id}`}>
                            <ListItemText primary={project.name} />
                            <ListItemIcon sx={{ justifyContent: 'end' }}>
                                <ChevronRightIcon />
                            </ListItemIcon>
                        </ListItemButton>
                        <Divider />
                    </Fragment>
                )}
            </List>
        </Stack>
    );
}