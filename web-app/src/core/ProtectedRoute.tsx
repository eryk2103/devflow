import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router";
import Loading from "./Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading isLoading={loading} />
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" />
}