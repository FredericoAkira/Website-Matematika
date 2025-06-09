import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface ChangePasswordReq {
    userId: string,
    oldPassword: string,
    newPassword: string
}

export default function usePostChangePassword() {
    return useMutation({
        mutationKey: ["changePassword"],
        mutationFn: async (request: ChangePasswordReq) => {
            const response = await api.post<Response>("/changePassword", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}