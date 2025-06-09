import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface ResultDetail {
    correctPercentage: number;
    pointsEarned: number;
    updatedExp: number;
}

export default function usePostFinalResult() {
    return useMutation({
        mutationKey: ["get_final_result"],
        mutationFn: async (attemptId: string) => {
            const response = await api.post<BaseResponse<ResultDetail>>(`/calculateResult?attemptId=${attemptId}`, null, {
                withCredentials: true
            });
            return response.data;
        }
    })
}