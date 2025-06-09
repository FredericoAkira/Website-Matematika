import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface QuizDetail {
    quizId: string;
    quizName: string;
    grade: string;
    difficulty: string;
    quizContent: {
        questionId: string;
        question: string;
        image: string;
        options: string[];
        correctAnswer: string;
        difficulty: string;
        solution:{
            explanation: string;
            text: string;
            image: string;
            video: string;
        };
    }[];
}

export default function useGetQuizDetail(quizName: string){
    return useQuery({
        queryKey: ["quiz_detail", quizName],
        queryFn: () => {
            const response = api.get<BaseResponse<QuizDetail>>("admin/getQuizDetail", {
                params: { quizName },
                withCredentials: true,
            });
            return response;
        }
    })
}