import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface EditQuizRequest {
    quizId: string | null;
    quizName: string | null;
    questions: {
        questionId?: string;
        question: string | null,
        image: string | null,
        options: string[],
        correctAnswer: string | null,
        difficulty: string | null,
        solution: {
            explanation: string | null,
            text: string | null,
            image: string | null,
            video: string | null
        }
    }[]
    difficulty: string | null;
    grade: string | null;
}

export default function usePostEditQuiz() {
    return useMutation({
        mutationKey: ["edit_quiz"],
        mutationFn: async (request: EditQuizRequest) => {
            const response = await api.put<Response>("/admin/editQuiz", request, {
                withCredentials: true
            })
            return response.data;
        }
    })
}