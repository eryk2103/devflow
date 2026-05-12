import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
    const { logout } = useAuth();

    return (
        <Stack>
            <Paper square sx={{ p: 2 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h4" color="primary">Devflow</Typography>
                    <IconButton onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </Stack>
            </Paper>
            <Stack sx={{ p: 2 }}>
                <Outlet />
            </Stack>
        </Stack>
    );
}