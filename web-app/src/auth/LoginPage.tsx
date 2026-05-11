import LoginForm, { type LoginFormData } from "./LoginForm";

export default function LoginPage() {
    const handleLogin = (data: LoginFormData) => {
        console.log(data);
    }

    return (
        <LoginForm onSubmit={handleLogin} />
    );
}