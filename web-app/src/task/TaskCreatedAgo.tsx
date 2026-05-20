import { Typography } from "@mui/material"
import { timeAgo } from "../shared/timeAgo"

export const TaskCreatedAgo = ({ datetime }: { datetime: string }) => {
    return <Typography variant="body2">{timeAgo(datetime)}</Typography>
}