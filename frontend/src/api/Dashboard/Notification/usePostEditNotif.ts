import { useMutation } from "@tanstack/react-query";
import api from "../../axios";

export interface EditNotifReq {
    itemTwo: string;
    itemOne: string;
}

export default function usePostEditNotif() {
    return useMutation({
        mutationKey: ["edit_notification"],
        mutationFn: async (request: EditNotifReq) => {
            const response = await api.post<Response>("/updateNotification", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}