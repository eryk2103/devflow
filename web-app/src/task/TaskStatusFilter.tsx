import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function TaskStatusFilter() {
    const [status, setStatus] = useState<string>("TODO");

    const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newStatus: string) => {
        setStatus(newStatus);
    };

    return (
        <ToggleButtonGroup
            value={status}
            exclusive
            onChange={handleAlignment}
            aria-label="status"
        >
            <ToggleButton value="TODO">TODO</ToggleButton>
            <ToggleButton value="IN_PROGRESS">IN PROGRESS</ToggleButton>
            <ToggleButton value="DONE">DONE</ToggleButton>

        </ToggleButtonGroup>
    );
}