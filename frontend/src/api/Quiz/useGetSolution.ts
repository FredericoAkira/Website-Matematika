import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number;
    data: {
        explanation: string;
        text: string;
        image: string;
        video: string;
    };
    message: string;
    status: string;
}

export default function useGetSolution() {
        return useMutation({
            mutationKey: ["getSolution"],
            mutationFn: async (questionId: string) => {
                const response = await api.get<Response>("/getSolution", {
                    params: {
                        questionId
                    },
                    withCredentials: true
                })
                return response.data
            }
        })
    }