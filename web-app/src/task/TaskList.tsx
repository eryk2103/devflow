import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Task } from "./models";
import { Link } from "react-router";
import { TASKS_DATA } from "../data";

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        setTasks(TASKS_DATA);
    }, []);

    return (
        <List>
            {tasks.map(task =>
                <Fragment key={task.id}>
                    <ListItemButton component={Link} to={`task/${task.id}`}>
                        <ListItemText primary={task.name} />
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