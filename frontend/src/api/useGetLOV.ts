import { useMutation } from "@tanstack/react-query";
import api from "./axios";

interface LovResponse {
    name: string,
    id: string,
    description: string | null,
    parent: string | null
}

export default function useGetLOV() {
    return useMutation({
        mutationKey: ["get_lov"],
        mutationFn: ({ type, search }: { type: string; search?: string }) => {
            return api.post<BaseResponse<LovResponse[]>>(
                "/list-of-values",
                { type, search },
                { withCredentials: true }
            );
        },
        retry: false
    });
}