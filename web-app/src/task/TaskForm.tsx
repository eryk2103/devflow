import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import PageHeader from "../shared/PageHeader";
import { priorities, statuses, types, type Task } from "./models";

const taskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long.").max(100, "Name must be 100 characters or less"),
    description: z.string().min(3, "Description must be at least 3 characters long or empty.").max(500, "Description must be 500 characters or less"),
    type: z.string(),
    status: z.string(),
    priority: z.string(),
});

export type TaskFormData = z.infer<typeof taskSchema>

type Props = {
    onSubmit: (data: TaskFormData) => void;
    title: string;
    onCancelNavigate: string;
    error: string;
    task?: Task | null;
}

export default function TaskForm({ onSubmit, title, onCancelNavigate, error, task }: Props) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: task?.name || "",
            description: task?.description || "",
            type: task?.type || "FEATURE",
            status: task?.status || statuses[0],
            priority: task?.priority || priorities[0],
        },
    });

    return (
        <Stack spacing={3}>
            <PageHeader title={title} path={onCancelNavigate} />
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField fullWidth variant="outlined" label="Name" required {...register("name")} error={!!errors.name} helperText={errors?.name?.message} />
                    <TextField multiline rows={7} fullWidth variant="outlined" label="Description" required {...register("description")} error={!!errors.description} helperText={errors?.description?.message} />
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth error={!!errors.type}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="type-label"
                                        label="Type"
                                    >
                                        {types.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth error={!!errors.status}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label="Status"
                                    >
                                        {statuses.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth error={!!errors.priority}>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="priority-label"
                                        label="Priority"
                                    >
                                        {priorities.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>
                    <Stack sx={{ flexDirection: { md: "row-reverse" }, justifyContent: { md: "flex-end" }, gap: 3 }}>
                        <Button type="submit" variant="contained" fullWidth sx={{ width: { md: 150 } }}>Submit</Button>
                        <Button type="button" variant="outlined" fullWidth component={Link} to={onCancelNavigate} sx={{ width: { md: 150 } }}>Cancel</Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
}