import { IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function PageHeader({ title, path }: { title: string, path: string }) {
    return (
        <Stack direction="row" spacing={1}>
            <IconButton aria-label="navigate back" color="primary" component={Link} to={path}>
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h4">{title}</Typography>
        </Stack>
    );
}