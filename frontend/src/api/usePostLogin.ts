import { useMutation } from "@tanstack/react-query";
import api from "./axios";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface Response {
        data: {
            id: string | null
            role: string
        }
}

export default function usePostLogin() {
    return useMutation({
        mutationKey: ["user_login"],
        mutationFn: async (request: LoginRequest) => {
            const response = await api.post<Response>("/login", request, {
                withCredentials: true
            });
            return response.data;
        }
    })
}