import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface UserQuizAccessReq {
    itemOne: string;
    itemTwo: string;
}

export interface Response {
    code: number;
    data: string;
    message: string;
    status: string;
}

export default function usePostAccessQuiz() {
        return useMutation({
            mutationKey: ["setAccessQuiz"],
            mutationFn: async (request: UserQuizAccessReq) => {
                const response = await api.post<Response>("/accessQuiz", request, {
                    withCredentials: true
                })
                return response.data
            }
        })
    }