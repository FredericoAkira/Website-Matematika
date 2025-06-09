import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostDeleteMaterial() {
    return useMutation({
        mutationKey: ["delete_material"],
        mutationFn: async (request: string) => {
            const response = await api.delete(`/admin/deleteMaterial/${request}`, {
                withCredentials: true
            });
            return response.data;
        }
    })
}