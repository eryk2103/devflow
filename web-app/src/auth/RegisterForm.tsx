import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import z from "zod";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Password is required.")
});

export type LoginFormData = z.infer<typeof loginSchema>;

type Props = {
    onSubmit: (data: LoginFormData) => void;
    error: string;
}

export default function RegisterForm({ onSubmit, error }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    return (
        <Stack spacing={4}>
            <Typography variant="h4">Sign up</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <TextField type="email" label="Email" fullWidth autoComplete="email" {...register("email")} error={!!errors.email} helperText={errors?.email?.message} required />
                    <TextField type="password" label="Password" fullWidth autoComplete="current-password" {...register("password")} error={!!errors.password} helperText={errors?.password?.message} required />
                    <Button type="submit" variant="contained" size="large" sx={{ width: { md: 100 } }}>Sign up</Button>
                </Stack>
            </form>
        </Stack>
    );
}