import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number,
    status: string,
    message: string,
    data: {
        label: string,
        value: string
    }[]
}

export default function useGetChatList(userId: string) {
    return useQuery({
        queryKey: ["chat_list", userId],
        queryFn: async () => {
            const response = await api.get<Response>(`/api/messages/getChatList`, {
                params: { userId },
                withCredentials: true,
            });
            return response.data;
        },
        keepPreviousData: true,
        retry: false
    });
}