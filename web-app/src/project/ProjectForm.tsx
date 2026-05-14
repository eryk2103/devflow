import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import PageHeader from "../shared/PageHeader";
import type { ProjectDetail } from "./models";

const projectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long.").max(100, "Name must be 50 characters or less"),
    description: z.string().min(3, "Description must be at least 3 characters long or empty.").max(250, "Description must be 250 characters or less").optional().or(z.literal(""))
});

export type ProjectFormData = z.infer<typeof projectSchema>

type Props = {
    onSubmit: (data: ProjectFormData) => void;
    title: string;
    onCancelNavigate: string;
    error: string;
    project?: ProjectDetail | null;
}

export default function ProjectForm({ onSubmit, title, onCancelNavigate, error, project }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: project?.name,
            description: project?.description
        }
    });

    return (
        <Stack spacing={3}>
            <PageHeader title={title} path={onCancelNavigate} />
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField fullWidth variant="outlined" label="Name" required {...register("name")} error={!!errors.name} helperText={errors?.name?.message} />
                    <TextField multiline rows={7} fullWidth variant="outlined" label="Description" {...register("description")} error={!!errors.description} helperText={errors?.description?.message} />
                    <Stack sx={{ flexDirection: { md: "row-reverse" }, justifyContent: { md: "flex-end" }, gap: 3 }}>
                        <Button type="submit" variant="contained" fullWidth sx={{ width: { md: 150 } }}>Submit</Button>
                        <Button type="button" variant="outlined" fullWidth component={Link} to={onCancelNavigate} sx={{ width: { md: 150 } }}>Cancel</Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
}