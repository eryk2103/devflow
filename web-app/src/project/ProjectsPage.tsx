import { Button, Stack, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ProjectList from "./ProjectList";
import { useState } from "react";
import { Link } from "react-router";

export default function ProjectsPage() {
    const [search, setSearch] = useState<string>('');

    return (
        <Stack spacing={3}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h4">Projects</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} component={Link} to="/project/new">
                    New
                </Button>
            </Stack>
            <TextField label="Search" variant="outlined" onChange={(e) => setSearch(e.target.value)} />
            <ProjectList search={search} />
        </Stack>
    );
}