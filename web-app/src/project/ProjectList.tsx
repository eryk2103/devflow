import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from "react";
import type { Project } from "./models";
import { PROJECTS_DATA } from "../data";
import { Link } from "react-router";

type Props = {
    search?: string;
}

export default function ProjectList({ search }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        let projects: Project[] = PROJECTS_DATA;
        if (search) {
            projects = projects.filter((project) => {
                return project.name.toLocaleLowerCase().includes(search.toLowerCase())
            });
        }
        setProjects(projects);
    }, [search]);

    return (
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
    );
}