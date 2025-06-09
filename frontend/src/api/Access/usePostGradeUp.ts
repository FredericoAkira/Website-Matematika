import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export default function usePostGradeUp() {
        return useMutation({
            mutationKey: ["naikKelas"],
            mutationFn: async (userId: string) => {
                const response = await api.post<Response>("/gradeUp", userId, {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    withCredentials: true,
                });
                return response.data;
            }
        })
    }