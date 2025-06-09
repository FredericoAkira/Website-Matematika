import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostDeleteTopic() {
    return useMutation({
        mutationKey: ["delete_topic"],
        mutationFn: async (request: string) => {
            const response = await api.delete(`/admin/deleteTopic/${request}`, {
                withCredentials: true
            });
            return response.data;
        }
    })
}