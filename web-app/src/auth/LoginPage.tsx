import { useState } from "react";
import { useAuth } from "./AuthContext";
import LoginForm, { type LoginFormData } from "./LoginForm";
import Loading from "../core/Loading";
import { useNavigate } from "react-router";
import { Button, Divider, Stack } from "@mui/material";

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (data: LoginFormData) => {
        setLoading(true);
        try {
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
            <Stack sx={{ width: { xs: "100%", sm: 500, md: 700 } }} >
                <Loading isLoading={loading} />
                <LoginForm onSubmit={handleLogin} error={error} />
            </Stack>
        </Stack >
    );
}