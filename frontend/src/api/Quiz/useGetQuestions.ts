import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface QuizDetail {
    questionId: string;
    question: string;
    image: string;
    options: string[] | null;
}

export default function useGetQuestions(attemptId: string, quizName: string){
    return useQuery({
        queryKey: ["get_questions", quizName, attemptId],
        queryFn: () => {
            const response = api.get<BaseResponse<QuizDetail[]>>("/getQuestions", {
                params: { attemptId, quizName },
                withCredentials: true,
            });
            return response;
        },
        enabled: !!quizName,
    })
}