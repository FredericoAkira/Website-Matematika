import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostDeleteQuiz() {
    return useMutation({
        mutationKey: ["delete_Quiz"],
        mutationFn: async (request: string) => {
            const response = await api.delete(`/admin/deleteQuiz/${request}`, {
                withCredentials: true
            });
            return response.data;
        }
    })
}