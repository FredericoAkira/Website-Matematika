import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface ChangeDataReq {
    userId: string;
    username: string;
    email: string;
}

export default function usePostChangeData() {
    return useMutation({
        mutationKey: ["changeData"],
        mutationFn: async (request: ChangeDataReq) => {
            const response = await api.post<Response>("/updateProfile", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}