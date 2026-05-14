import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../user/models";

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const newToken = await refresh();
                await getUser(newToken);
            }
            catch {
                logout();
            }
            finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${import.meta.env.VITE_AUTH_PROVIDER_URL}/login`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: `grant_type=password&username=${email}&password=${password}`
        });

        const data = await res.json();

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("Invalid credentials")
            }
            throw new Error("Something went wrong")
        }

        setToken(data.access_token);
        await getUser(data.access_token);
    }

    const getUser = async (accessToken: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("Invalid or expired token")
            }
            throw new Error("Something went wrong")
        }
        setUser(data);
    }

    const logout = async () => {
        setUser(null);
        setToken(null);
    }

    const refresh = async () => {
        const res = await fetch(`${import.meta.env.VITE_AUTH_PROVIDER_URL}/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!res.ok) {
            logout();
        }

        const data = await res.json();
        setToken(data.access_token);
        return data.access_token;
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be inside AuthProvider");
    }
    return context;
}