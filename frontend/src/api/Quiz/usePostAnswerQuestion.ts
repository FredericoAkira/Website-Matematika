import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface SubmitAccessReq {
    attemptId: string;
    questionId: string;
    userAnswer: string;
}

export interface Response {
    code: number;
    data: {
        userAnswer: string;
        isCorrect: boolean;
        correctAnswer: string;
    };
    message: string;
    status: string;
}

export default function usePostAnswerQuestion() {
        return useMutation({
            mutationKey: ["answerQuestion"],
            mutationFn: async (request: SubmitAccessReq) => {
                const response = await api.post<Response>("/answerQuiz", request, {
                    withCredentials: true
                })
                return response.data
            }
        })
    }