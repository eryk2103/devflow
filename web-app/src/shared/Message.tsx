import { Stack, Typography } from "@mui/material";

export default function Message({ value }: { value: string }) {
    return (
        <Stack sx={{ alignItems: "center" }}>
            <Typography variant="body1" sx={{ mt: 5 }}>{value}</Typography>
        </Stack>
    );
}