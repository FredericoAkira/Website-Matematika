import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface Response {
    code: number;
    data: {
        questionId: string;
        userAnswer: string;
        isCorrect: boolean;
        correctAnswer: string;
    }[];
    message: string;
    status: string;
}

export default function useGetQuizDetailUser(userId: string, quizName: string) {
        return useQuery({
            queryKey: ["getDetailQuiz_user", userId, quizName],
            queryFn: async () => {
                const response = await api.get<Response>("/resultQuiz", {
                    params: {
                        userId,
                        quizName
                    },
                    withCredentials: true
                })
                return response.data
            },
            enabled: !!quizName,
        })
    }