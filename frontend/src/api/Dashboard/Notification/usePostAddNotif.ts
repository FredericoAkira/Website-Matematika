import { useMutation } from "@tanstack/react-query";
import api from "../../axios";

export interface AddNotifReq {
    senderId: string;
    receiverId: string;
    header: string;
    content: string;
    status: string;
}

export default function usePostAddNotif() {
    return useMutation({
        mutationKey: ["add_notification"],
        mutationFn: async (request: AddNotifReq) => {
            const response = await api.post<Response>("/addNotification", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}