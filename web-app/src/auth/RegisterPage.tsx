import { useState } from "react";
import { useAuth } from "./AuthContext";
import Loading from "../core/Loading";
import { useNavigate } from "react-router";
import { Link, Stack } from "@mui/material";
import { Link as RouterLink } from 'react-router';
import RegisterForm, { type RegisterFormData } from "./RegisterForm";

export default function RegisterPage() {
    const { login, register } = useAuth();
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await register(data.email, data.password);
            await login(data.email, data.password);
            navigate("/");
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Something went wrong");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Stack sx={{ alignItems: "center" }}>
            <Stack sx={{ width: { xs: "100%", sm: 500, md: 700 } }} spacing={3}>
                <Loading isLoading={loading} />
                <RegisterForm onSubmit={handleRegister} error={error} />
                <Link component={RouterLink} to="/login">Already have an account? Sign in here.</Link>
            </Stack>
        </Stack >
    );
}