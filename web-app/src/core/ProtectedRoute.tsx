import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    if (user) {
        return children;
    }
    return <Navigate to="/login" />
}