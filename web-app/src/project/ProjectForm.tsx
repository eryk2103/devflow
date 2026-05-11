import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import PageHeader from "../shared/PageHeader";

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
}

export default function ProjectForm({ onSubmit, title, onCancelNavigate, error }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

    return (
        <Stack spacing={3}>
            <PageHeader title={title} path={onCancelNavigate} />
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField fullWidth variant="outlined" label="Name" required {...register("name")} error={!!errors.name} helperText={errors?.name?.message} />
                    <TextField multiline rows={7} fullWidth variant="outlined" label="Description" {...register("description")} error={!!errors.description} helperText={errors?.description?.message} />
                    <Stack spacing={3}>
                        <Button type="submit" variant="contained" fullWidth>Submit</Button>
                        <Button type="button" variant="outlined" fullWidth component={Link} to={onCancelNavigate}>Cancel</Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
}