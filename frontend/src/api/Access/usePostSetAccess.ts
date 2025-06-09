import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AccessReq {
    userId: string;
    type: string;
    itemName: string;
}

export default function usePostSetAccess() {
        return useMutation({
            mutationKey: ["setAccessAdmin"],
            mutationFn: async (request: AccessReq) => {
                const response = await api.post<Response>("/admin/access", request, {
                    withCredentials: true
                })
                return response.data
            }
        })
    }