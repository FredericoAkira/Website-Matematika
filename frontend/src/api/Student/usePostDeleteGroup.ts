import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostDeleteGroup() {
    return useMutation({
        mutationKey: ["delete_Group"],
        mutationFn: async (groupId: string) => {
            const response = await api.delete(`/deleteGroup/${groupId}`, {
                withCredentials: true
            });
            return response.data;
        }
    })
}