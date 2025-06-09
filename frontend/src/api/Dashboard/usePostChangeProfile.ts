import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface ChangeProfileReq {
    itemOne: string,
    itemTwo: string,
}

export default function usePostChangeProfile() {
    return useMutation({
        mutationKey: ["changeProfile"],
        mutationFn: async (request: ChangeProfileReq) => {
            const response = await api.post<Response>("/changePhoto", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}