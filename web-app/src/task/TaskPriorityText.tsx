import { Typography } from "@mui/material"
import { type TaskPriority } from "./models";

const prioritiesColors: Record<TaskPriority, string> = {
    "LOW": "primary",
    "MEDIUM": "info",
    "HIGH": "warning",
    "CRITICAL": "error"
}

export const TaskPriorityText = ({ priority }: { priority: TaskPriority }) => {
    return <Typography variant="body2" color={prioritiesColors[priority]}>{priority}</Typography>;
}