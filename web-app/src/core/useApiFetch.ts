import { useAuth } from "../auth/AuthContext";

export default function useApiFetch() {
    const { token, refresh, logout } = useAuth();

    const fetchApi = async (url: string, init?: RequestInit): Promise<Response> => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            ...init
        });

        if (res.status !== 401) {
            return res;
        }

        const newToken = await refresh();

        const retryRes = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${newToken}`
            },
            ...init
        });

        if (retryRes.status === 401) {
            logout();
        }

        return retryRes;
    }

    return { fetchApi };
}