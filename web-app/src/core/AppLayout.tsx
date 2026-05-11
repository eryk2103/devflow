import { Paper, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router";

export default function AppLayout() {
    return (
        <Stack>
            <Paper square sx={{ p: 2 }}>
                <Typography variant="h4" color="primary">Devflow</Typography>
            </Paper>
            <Stack sx={{ p: 2 }}>
                <Outlet />
            </Stack>
        </Stack>
    );
}