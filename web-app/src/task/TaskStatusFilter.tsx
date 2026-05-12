import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { TaskStatus } from "./models";

type Props = {
    status: TaskStatus,
    onChange: (_event: React.MouseEvent<HTMLElement>, newStatus: TaskStatus) => void;
}

export default function TaskStatusFilter({ status, onChange }: Props) {
    return (
        <ToggleButtonGroup
            value={status}
            exclusive
            onChange={onChange}
            aria-label="status"
        >
            <ToggleButton value="TODO">TODO</ToggleButton>
            <ToggleButton value="IN_PROGRESS">IN PROGRESS</ToggleButton>
            <ToggleButton value="DONE">DONE</ToggleButton>

        </ToggleButtonGroup>
    );
}