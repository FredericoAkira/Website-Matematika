import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddQuizRequest {
    userId: string;
    quiz: {
        quizName: string;
        questions: {
            question: string,
            image: string,
            options: string[],
            correctAnswer: string,
            difficulty: string,
            solution: {
                explanation: string,
                text: string,
                image: string,
                video: string
            }
        }[]
        difficulty: string;
        grade: string;
    }
}

export default function usePostAddQuiz() {
    return useMutation({
        mutationKey: ["add_Quiz"],
        mutationFn: async (request: AddQuizRequest) => {
            const response = await api.post<Response>("/admin/addQuiz", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}