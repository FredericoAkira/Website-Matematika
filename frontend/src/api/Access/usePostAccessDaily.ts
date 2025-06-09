import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostAccessDaily() {
        return useMutation({
            mutationKey: ["setAccessDaily"],
            mutationFn: async (userId: string) => {
                const response = await api.post<Response>("/doDaily", userId, {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    withCredentials: true,
                });
                return response.data;
            }
        })
    }